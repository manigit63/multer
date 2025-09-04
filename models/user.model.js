const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  userPassword: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model("UserCollection", userSchema);
