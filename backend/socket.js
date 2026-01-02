const { Server } = require("socket.io");
const Message = require("./Message");

const onlineUsers = new Map(); // userId -> socketId

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔹 Track online user
    socket.on("join", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log("Online users:", onlineUsers);
      }
    });

    // 🔹 Send message only to receiver + sender
    socket.on("sendMessage", async ({ sender, receiver, text , tempId}) => {
      if (!sender || !receiver || !text) return;

      const senderId = typeof sender === "object" ? sender._id : sender;

      // Save to DB
      const msg = await Message.create({  // Single create
  sender: senderId,
  receiver,
  text,
  tempId
});
      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", msg);
      }

      // Send back to sender to update their own chat
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", msg);
      }
    });

    // 🔹 Remove user from online list on disconnect
    socket.on("disconnect", () => {
      for (let [userId, sId] of onlineUsers) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};
