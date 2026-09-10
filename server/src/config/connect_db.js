const { MONGO_URI } = require("../config/env");
const mongoose = require("mongoose");

const connectionString = MONGO_URI;
mongoose.set('strictQuery', false);

const connectDatabase = async () => {
  try {
    await mongoose
      .connect(connectionString)
      .then(() => {
        console.log('Connection established to MongoDB database successfully!');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
      });
  } catch (error) {
    console.error('Database connection error: ', error);
  }
};

module.exports = connectDatabase;
