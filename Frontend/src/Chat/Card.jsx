import React, { useState } from "react";

const Card = () => {
  const [conversationId, setConversationId] = useState("default");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch('http://localhost:8000/api/chatbot/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
        }),
      });

      const data = await res.json();

      setMessages([...newMessages, { from: 'bot', text: data.response }]);
      setConversationId(data.conversation_id);
    } catch (err) {
      setMessages([...newMessages, {
        from: 'bot',
        text: '❌ Unable to connect to Ira. Please try again later.',
      }]);
    }

    setInput('');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col h-[400px]">
        <div className="px-4 py-3 border-b dark:border-zinc-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">Chatbot Assistant</h2>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</div>
          </div>
        </div>

        <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${
                msg.from === 'user' ? 'self-end bg-blue-500' : 'self-start bg-zinc-500'
              } text-white max-w-xs rounded-lg px-3 py-1.5 text-sm`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t dark:border-zinc-700">
          <div className="flex gap-2">
            <input
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
