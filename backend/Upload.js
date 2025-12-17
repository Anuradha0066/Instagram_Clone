const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ImgUrl: { type: String, required: true },
   likeCount: {
    type: Number,
    default: 0
  },

  // LINKING USER SCHEMA
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
        required: true
    },
    likedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}]


}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
