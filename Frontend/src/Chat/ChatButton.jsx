import React, { useState } from "react";
import ChatModal from "./ChatModal";
import Ira from "./Ira.gif";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex justify-center items-center bg-purple-300 rounded-full shadow-lg transition-all duration-500 group-hover:scale-90"
          >
            <img src={Ira} alt="Chatbot" className="w-14 h-14" />

            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 text-white font-bold text-xs bg-purple-400 px-3 py-1 rounded-full shadow-lg whitespace-nowrap transition-all duration-300">
              Chat with Ira
            </span>
          </button>
        </div>
      )}

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatButton;
