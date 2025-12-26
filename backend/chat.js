const express = require("express");
const router = express.Router();
const Message = require("./Message");
const auth  = require("./Auth");

router.get("/:userId", auth, async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (err) {
    console.error("CHAT FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;