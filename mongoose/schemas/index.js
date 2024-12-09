const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
});
const LogSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

module.exports = {
  ExerciseSchema,
  UserSchema,
  LogSchema,
};
