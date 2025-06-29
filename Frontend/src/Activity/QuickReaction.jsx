import React, { useState } from "react";

export default function QuickReaction() {
  const [waiting, setWaiting] = useState(false);
  const [readyBox, setReadyBox] = useState(null); // 0 or 1 means which box goes green
  const [start, setStart] = useState(0);
  const [result, setResult] = useState(null);

  const startGame = () => {
    setResult(null);
    setWaiting(true);
    setReadyBox(null);
    const timeout = Math.random() * 2000 + 2000;

    setTimeout(() => {
      const randomBox = Math.floor(Math.random() * 2); // pick 0 or 1
      setReadyBox(randomBox);
      setWaiting(false);
      setStart(Date.now());
    }, timeout);
  };

  const clickHandler = (boxIndex) => {
    if (waiting) {
      setResult("⏱️ Too soon! Wait for green.");
    } else if (readyBox === null) {
      setResult("Click Start to begin!");
    } else if (boxIndex === readyBox) {
      const reactionTime = Date.now() - start;
      setResult(`⚡ Reaction Time: ${reactionTime}ms`);
      setReadyBox(null);
    } else {
      setResult("❌ Wrong box! Try again.");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md transition hover:scale-105">
      <h3 className="text-lg font-bold mb-4 text-purple-600">⚡ Quick Reaction</h3>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            onClick={() => clickHandler(i)}
            className={`h-32 flex items-center justify-center rounded-xl cursor-pointer transition-colors duration-500 ${
              readyBox === i
                ? "bg-green-300"
                : waiting || readyBox !== null
                ? "bg-red-300"
                : "bg-purple-200"
            }`}
          >
            {readyBox === i
              ? "Go!"
              : waiting || readyBox !== null
              ? "Wait..."
              : "Ready"}
          </div>
        ))}
      </div>
      <button
        onClick={startGame}
        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600"
      >
        Start
      </button>
      {result && (
        <p className="mt-4 text-purple-700 font-semibold">{result}</p>
      )}
    </div>
  );
}
