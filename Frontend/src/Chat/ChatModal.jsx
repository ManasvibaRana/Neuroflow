import React from "react";
import ChatPage from "./Chatpage";
import { IoClose } from "react-icons/io5"; // icon for close

const ChatModal = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[90%] max-w-md transition-all duration-300 origin-bottom-right ${
        isOpen
          ? "scale-100 opacity-100"
          : "scale-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-purple-200 bg-white">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-purple-500 hover:text-purple-700 z-50"
        >
          <IoClose size={24} />
        </button>

        <ChatPage />
      </div>
    </div>
  );
};

export default ChatModal;
