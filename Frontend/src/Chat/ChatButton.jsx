import React, { useState } from "react";
import ChatModal from "./ChatModal";
import Ira from "./Ira.gif";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button (Hidden when modal open) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#796fc1] rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <img src={Ira} alt="Chatbot" className="w-16 h-16" />
        </button>
      )}

      {/* Expandable Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatButton;
