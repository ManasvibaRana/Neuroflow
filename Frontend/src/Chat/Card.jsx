import React, { useState } from "react";

const ChatPage = () => {
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
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Placeholder for Navbar */}
      <header className="p-4 bg-white dark:bg-zinc-800 shadow-md">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-white">Navbar Placeholder</h1>
      </header>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs rounded-lg px-3 py-1.5 text-sm text-white ${
                msg.from === 'user'
                  ? 'self-end bg-blue-500'
                  : 'self-start bg-zinc-600'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t dark:border-zinc-700 p-4">
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
