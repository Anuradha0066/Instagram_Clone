import React from "react";

const ChatUserList = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-60px)]">

      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => onSelectUser(user)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900
            ${
              selectedUser?._id === user._id
                ? "bg-zinc-900"
                : ""
            }
          `}
        >
          {/* Avatar */}
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-10 h-10 rounded-full bg-zinc-800"
          />

          {/* Name */}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-gray-400">
              Tap to chat
            </span>
          </div>
        </button>
      ))}

    </div>
  );
};

export default ChatUserList;