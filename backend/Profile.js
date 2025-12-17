const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  username: String,
  bio: String,
  profileImage: String,

  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  posts: Number
});


