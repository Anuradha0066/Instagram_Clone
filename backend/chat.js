const express = require("express");
const router = express.Router();
const Message = require("./Message");
const auth = require("./Auth");  // Ya "../middleware/auth"

router.get("/:userId", auth, async (req, res) => {
  try {
    // ✅ SAFE: JWT decoded.id already string
    const myId = req.user.id || req.user._id;  // Flexible
    const otherUserId = req.params.userId;

    console.log("🔍 Chat:", myId, "vs", otherUserId);

    if (!myId || !otherUserId) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    })
    .populate("sender", "name")
    .populate("receiver", "name")
    .sort({ createdAt: 1 });

    console.log("📤 Success:", messages.length, "messages");
    res.json(messages);
    
  } catch (err) {
    console.error("💥 CHAT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
