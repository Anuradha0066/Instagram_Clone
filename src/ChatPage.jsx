import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatUserList from "./ChatUserList";
 import ChatWindow from "./ChatWindow";


 const API_URL = 'http://localhost:4001';
//  const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'
 

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);


  useEffect(() => {
  const newSocket = io(API_URL);
  setSocket(newSocket);
  
  return () => newSocket.disconnect();
}, []);



  useEffect(() => {
    const token = localStorage.getItem("instagram_token");
    if (!token) return;
console.log("Fetching users with token:", token);
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {

          headers: { Authorization:`Bearer ${token}` },
        });
          console.log("response", res);
        setUsers(res.data.following || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="fixed left-[0px] top-0 right-0 bottom-0 bg-black text-white flex">

      {/* LEFT PANEL */}
      <div className="w-[320px] border-r border-zinc-800">
        <div className="p-4 border-b border-zinc-800 font-semibold">
          Messages
        </div>

        {loading ? (
          <p className="p-4 text-sm text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">
            You are not following anyone.
          </p>
        ) : (
          <ChatUserList
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1">
        {!selectedUser ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
<ChatWindow selectedUser={selectedUser} socket={socket} />  // ✅ socket pass!
        )}
      </div>

    </div>
  );
};

export default ChatPage;

