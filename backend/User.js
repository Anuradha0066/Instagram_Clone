const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passWord: { type: String, required: true },

  username: { type: String, unique: true },

  role: { type: String, default: "user" },

  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  },

  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  // ✅ FIXED: Add posts field
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
