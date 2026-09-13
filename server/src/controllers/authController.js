const { JWT_TOKEN_COOKIE_EXPIRES } = require('../config/env');
const { loginResponse } = require('../utils/response');
const {generateAccessToken, generateRefreshToken} = require('../utils/jwt');
const User = require('../models/user');
const Class = require('../models/class');
const ClassMember = require('../models/classMember');
const validateEmail = require('../validators/emailFormat');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/** Register User via Admin Invitation Link (Token-based)
 *  POST /routes/auth/register
 */ 
exports.register = async (req, res) => {
    //Start a Mongoose Session for Atomic Operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try { 
        const {token, username, password, name, email} = req.body; 

        // 1. Validate required fields 
        if (!token || !username || !password) {
            await session.endSession();
            return res.status(400).json({ 
                status: 'error',
                message: 'Token, username and password are required' }); 
            }

        // 2. Validate email format 
        if (email && !validateEmail(email)) { 
            await session.endSession();
            return res.status(400).json({ 
                status: 'error',
                message: 'Please provide a valid email address' }); 
            }

        // 3. Validate password length
        if (password.length < 6) {
            await session.endSession();
            return res.status(400).json({ 
                status: 'error',
                message: 'Password must be at least 6 characters' }); 
            }

        // 4. Find Class matching the token & verify 2-day expiration date limit
        const classDoc = await Class.findOne({
            $or: [
                {
                    studentJoinToken: token,
                    studentJoinTokenExpiresAt: { $gt: new Date() },
                },
                {
                    trainerInviteToken: token,
                    trainerInviteTokenExpiresAt: { $gt: new Date() },
                },
            ],
            isActive: true,
        }).session(session);

        if (!classDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: 'error',
                message: 'Invitation link is invalid, expired, or class is inactive',
            });
        }
        
        // 5. Automatically get role from token match
        const role = token === classDoc.studentJoinToken ? 'student' : 'trainer';

        // 6. Check if user already exists
        const trimmedUsername = username.trim();
        const formattedEmail = email ? email.trim().toLowerCase() : null;

        let user = await User.findOne({ username: trimmedUsername }).select('+password').session(session);

        if (!user && formattedEmail) {
            //Check if email belong to another existing account
            const emailUser = await User.findOne({ email: formattedEmail }).session(session);
            if (emailUser) {
                await session.abortTransaction();
                session.endSession();
                return res.status(409).json({
                    status: 'error',
                    message: 'Email address is already signed up by another account',
                });
            }
        }

        if (user) {
            //Existing User: Verify password to authorize joining the new class
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                await session.abortTransaction();
                session.endSession();
                return res.status(401).json({
                    status: 'error',
                    message: 'Incorrect password for existing account',
                });
            }

            //Check if user is already in this specific class
            const existingEnrollment = await ClassMember.findOne({
                classId: classDoc._id,
                userId: user._id,
            }).session(session);

            if (existingEnrollment) {
                await session.abortTransaction();
                session.endSession();
                return res.status(409).json({
                    status: 'error',
                    message: 'You are already enrolled in this class',
                });
            }
        } else {
            //New User: Validate name and create account
            if (!name || !name.trim()) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    status: 'error',
                    message: 'Name is required for new registration',
                });
            }
     
            //Pass session into create() using array syntax
            const [newUser] = await User.create([{
                name: name.trim(),
                username: username.trim(),
                password: password,
                email: email ? email.trim().toLowerCase() : undefined,
                role: role,
                isActive: true,
            }],
            { session });
            user = newUser;
        }

        // 7. Enroll New User in ClassMember
        await ClassMember.create([{
            classId: classDoc._id,
            userId: user._id,
            role,
        }],
        { session });

        //Commit changes to the database
        await session.commitTransaction();
        session.endSession();

        // 8. Generate JWT Tokens upon successful registration
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // 9. Return success response
        return res.status(201).json({
            status: 'success',
            message: 'Successfully enrolled in class',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    classId: classDoc._id,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);

        //Handle MongoDB duplicate key errors (code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field';
            return res.status(409).json({
                status: 'error',
                message: `An account with this ${field} already exists`,
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
        });
    }
};
/** 
 *  Controller for login 
 *  POST /routes/auth/login
 */ 

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // validate username and password
        if (!username || !password) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Username and password are required' });
        }
        const user = await User.findOne({ username: username.trim() }).select('+password');
        if (!user) {
        return res.status(404).json({ 
            status: 'error', 
            message: 'User does not exist' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'User password is incorrect' });
        }

        return loginResponse(res, user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
    }
};

/** 
 * Controller for logout
 * POST /routes/auth/logout
 */
exports.logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized access. Please login to continue' });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json({status: 'success', message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

/** 
 * Controller for user refresh-token
 * POST /routes/auth/refresh-token
 */
exports.refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User does not exist' });
    }
    const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }
    const accessToken = generateAccessToken(user._id);

    const options = {
      expires: new Date(Date.now() + JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('accessToken', accessToken, options);
    return res.status(200).json({ status: 'success', message: 'JWT refresh token generated successfully' });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
