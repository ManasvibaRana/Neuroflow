import React, { useState } from "react";

export default function MindfulCheckIn() {
  const tips = [
    "Take a deep breath 🌬️",
    "Sip some water 💦",
    "Stretch your arms 🙆",
    "Look outside for 30 sec 🌳",
  ];

  const [tip, setTip] = useState("");

  const getTip = () => {
    const random = tips[Math.floor(Math.random() * tips.length)];
    setTip(random);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
      <h3 className="text-lg font-bold mb-2 text-purple-500">🌿 Mindful Check-In</h3>
      <button
        className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500"
        onClick={getTip}
      >
        How are you?
      </button>
      {tip && <p className="mt-2 text-purple-800">{tip}</p>}
    </div>
  );
}
