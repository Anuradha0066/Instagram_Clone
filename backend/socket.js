const { Server } = require("socket.io");
const Message = require("./Message");

const onlineUsers = new Map();

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔹 SAME EVENT NAME AS FRONTEND
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online users:", onlineUsers);
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      if (!sender || !receiver || !text) return;

      console.log("Message from", sender, "to", receiver, ":", text);
      const msg = await Message.create({
        sender,
        receiver,
        text,
      });

      const receiverSocketId = onlineUsers.get(receiver);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", msg);
      }
    });

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