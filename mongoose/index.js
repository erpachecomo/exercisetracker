const mongoose = require("mongoose");
const schemas = require("./schemas");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

const Exercise = mongoose.model("Exercise", schemas.ExerciseSchema);
const User = mongoose.model("User", schemas.UserSchema);
const Log = mongoose.model("Log", schemas.LogSchema);

module.exports = {
  Exercise,
  User,
  Log
};
