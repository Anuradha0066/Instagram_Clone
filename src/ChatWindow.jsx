import React, { useEffect, useState } from "react";
import axios from "axios";

// const API_URL = "http://localhost:4001";
const API_URL = "https://instagram-clone-1-rfrs.onrender.com" || "http://localhost:4001";
const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatWindow = ({ selectedUser,socket }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("instagram_token");
  if (!token){
    console.error("No token found");
    return <div>Please log in to chat.</div>;
  }
  if (!socket) {
  return <div className="h-full flex items-center justify-center text-gray-400">Connecting...</div>;
}

  const me = JSON.parse(atob(token.split(".")[1]));
  const myId = me.id || me._id;

  // Join socket
  useEffect(() => {
    if (myId) socket.emit("join", myId);
  }, [myId, socket]);

  // Load old messages
  // ✅ FIXED: MERGE instead of REPLACE
// Load old messages - DEBUG VERSION
// useEffect loadMessages - SIMPLE VERSION
// Load messages - CLEAN VERSION
useEffect(() => {
  if (!selectedUser) {
    setMessages([]); // ✅ Clear on no user
    return;
  }
  
  const loadMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // ✅ 1. Completely replace (no prev merge!)
      // ✅ 2. Server messages already have _id (no temp-)
      setMessages(res.data.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
      
    } catch (err) {
      console.error("Load failed:", err);
      setMessages([]); // ✅ Clear on error
    }
  };
  loadMessages();
}, [selectedUser?._id, token]); // ✅ Depend only on selectedUser._id



  // Receive new messages
useEffect(() => {
  if (!selectedUser || !myId || !socket) return;
  
  const handler = (msg) => {
    // EXACT match only
    const isMyMsg = msg.sender._id === myId && msg.receiver === selectedUser._id;
    const isTheirMsg = msg.sender._id === selectedUser._id && msg.receiver === myId;
    
    if (!isMyMsg && !isTheirMsg) return;  // Wrong chat = ignore!
    
    setMessages(prev => {
      const tempIdx = prev.findIndex(m => m.tempId === msg.tempId);
      if (tempIdx !== -1) {
        const newArr = [...prev];
        newArr[tempIdx] = msg;
        return newArr;
      }
      if (prev.some(m => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  socket.on("receiveMessage", handler);  // ✅ prop socket
  return () => socket.off("receiveMessage", handler);
}, [selectedUser?._id, myId, socket]);  // ✅ STRICT deps



  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const msgData = {
      sender: myId,
      receiver: selectedUser._id,
      text: message,
      tempId,
    };

    // Send to backend
    socket.emit("sendMessage", msgData);

    // Optimistic UI with temp ID
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        tempId,
        sender: { _id: myId },
        receiver: selectedUser._id,
        text: message,
        createdAt: new Date(),
      },
    ]);

    setMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* HEADER */}
      <div className="h-[60px] border-b border-zinc-800 flex items-center gap-3 px-4">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedUser.name}`}
          className="w-9 h-9 rounded-full"
          alt=""
        />
        <p className="font-semibold">{selectedUser.name}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender?._id === myId;
          return (
            <div
              key={msg._id || msg.createdAt}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${
                    msg.sender?.name || "user"
                  }`}
                  className="w-7 h-7 rounded-full mr-2 mt-1"
                  alt=""
                />
              )}
              <div
                className={`max-w-[65%] px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-zinc-800 text-white rounded-bl-none"
                }`}
              >
                {!isMe && msg.sender?.name && (
                  <p className="text-xs text-gray-400 mb-1">{msg.sender.name}</p>
                )}
                <p>{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right opacity-70 ${
                    isMe ? "text-white" : "text-gray-300"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="h-[60px] border-t border-zinc-800 flex items-center px-4 gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="text-blue-500 font-semibold">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
