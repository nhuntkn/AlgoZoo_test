const User = require('../models/user');
const validateEmail = require('../validators/emailFormat');
const Class = require('../models/class');
const mongoose = require('mongoose');
// TODO: Controller for admin to get all users information
exports.getUser = async (req,res) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No users found',
      });
    }
    res.status(200).json(
      {
        status: "success",
        message: "Users information retrieved successfully",
        count: users.length,
        data:
        {
          users
        }
      }
    )
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for getting user info by ID (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User does not exist',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User information retrieved successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role || 'student', // Default to 'student' if role is not set
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// TODO: Controller for admin to get all users with role 'student' or 'trainer'
exports.getUserWithRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || (role !== 'student' && role !== 'trainer')) {
      return res.status(400).json({status: 'error', message: 'Invalid role. Please specify either "student" or "trainer".' });
    }

    const users = await User.find({ role }).select('-password');
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
// Controller for admin to get all classes (admin)
// GET /api/admin/classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();

    if (!classes.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No classes found',
      });
    }
    res.status(200).json(
      {
        status: "success",
        message: "Classes information retrieved successfully",
        count: classes.length,
        data:
        {
          classes
        }
      }
    )
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for admin to update user's active status
// PATCH /api/admin/users/:user_id
exports.updateUserActive = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid isActive (boolean) value',
      });
    }

    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const user = await User.findByIdAndUpdate(
      user_id,
      { isActive },
      { returnDocument: 'after' }
    ).select('-password');

    return res.status(200).json({
      status: 'success',
      message: 'User active status updated successfully',
      data: { user },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for admin to create a new class
// POST /api/admin/classes
exports.createClass = async (req, res) => {
  try {
    const { name, description = '' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Class name is required',
      });
    }

    const newClass = await Class.create({
      name: name.trim(),
      description,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Class created successfully',
      data: {
        class_id: newClass._id,
        name: newClass.name,
        description: newClass.description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for admin to update class details (name, description)
// PATCH /api/admin/classes/:class_id
exports.updateClassDetails = async (req, res) => {
  try {
    const class_id = req.params.class_id?.trim();

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid class_id',
      });
    }

    const { name, description } = req.body || {};

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Class name is required',
      });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description;

    const classDoc = await Class.findByIdAndUpdate(
      class_id,
      updateFields,
      { returnDocument: 'after' }
    );

    if (!classDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Class details updated successfully',
      data: {
        class_id: classDoc._id,
        name: classDoc.name,
        description: classDoc.description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for admin to update class active status
// PATCH /api/admin/classes/:class_id/active
exports.updateClassActive = async (req, res) => {
  try {
    const class_id = req.params.class_id?.trim();

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid class_id',
      });
    }

    const { isActive } = req.body || {};

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'isActive (boolean) is required',
      });
    }

    const classDoc = await Class.findByIdAndUpdate(
      class_id,
      { isActive, archivedAt: isActive ? null : new Date() },
      { returnDocument: 'after' }
    );

    if (!classDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Class active status updated successfully',
      data: { class: classDoc },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};