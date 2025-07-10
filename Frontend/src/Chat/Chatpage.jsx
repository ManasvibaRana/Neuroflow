import React, { useState } from "react";
import Ira from "./Ira.gif";

const ChatPage = () => {
  const [conversationId, setConversationId] = useState("default");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:8000/api/chatbot/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
        }),
      });

      const data = await res.json();

      setMessages([...newMessages, { from: "bot", text: data.response }]);
      setConversationId(data.conversation_id);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          from: "bot",
          text: "❌ Unable to connect. Please try again later.",
        },
      ]);
    }

    setInput("");
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4">

    <div className="w-full max-w-md h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-purple-500 bg-purple-400 flex items-center gap-3 ">
        <img
          src={Ira}
          alt="Bot"
          className="w-8 h-8 rounded-full shadow-2xl  shadow-emerald-950"
        />

        <h2 className="text-lg font-semibold text-purple-800">
          Ira's Little Cloud 🕊️
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 max-w-[75%] ${
              msg.from === "user" ? "self-end justify-end" : "self-start"
            }`}
          >
            {msg.from === "bot" && (
              <img src={Ira} alt="Bot" className="w-6 h-6 rounded-full" />
            )}

            <div
              className={`px-4 py-2 rounded-2xl text-sm ${
                msg.from === "user"
                  ? "bg-purple-200 text-purple-900"
                  : "bg-pink-100 text-pink-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-purple-100 p-4 bg-purple-50">
        <div className="flex gap-2">
          <input
            placeholder="Type a calm thought..."
            className="flex-1 px-4 py-2 rounded-full border border-purple-200 text-sm focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-purple-400 hover:bg-purple-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ChatPage;
