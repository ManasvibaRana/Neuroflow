import React, { useState } from "react";

const phrases = [
  "Focus fuels success",
  "Deep work beats busy work",
  "One thing at a time",
  "Discipline equals freedom",
  "Start now, not later",
  "Small steps every day",
  "Progress over perfection",
  "Consistency creates momentum",
  "Your future is now",
  "Distraction is the enemy",
  "Stay curious, stay sharp",
  "Finish what you start",
  "Plan, act, repeat",
  "Be present, not perfect",
  "Your mind is your power",
];

export default function TypingBurst() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [start, setStart] = useState(null);
  const [result, setResult] = useState(null);
  const [bestWpm, setBestWpm] = useState(0);

  const handleChange = (e) => {
    if (!start) setStart(Date.now());
    setInput(e.target.value);

    if (e.target.value === phrases[index]) {
      const time = (Date.now() - start) / 1000;
      const wpm = Math.round((phrases[index].split(" ").length / time) * 60);
      setResult(`🎉 Well done! Your speed: ${wpm} WPM`);
      if (wpm > bestWpm) setBestWpm(wpm);
      setTimeout(() => {
        setIndex((index + 1) % phrases.length);
        setInput("");
        setStart(null);
        setResult(null);
      }, 3000);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-md text-center transition hover:scale-105 flex flex-col justify-between h-full">
      <h3 className="text-lg font-bold mb-4 text-purple-600">⌨️ Typing Burst</h3>
      <p className="mb-4 text-gray-700">{phrases[index]}</p>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="px-4 py-2 border rounded w-full"
        placeholder="Type here..."
      />
      {result && (
        <p className="mt-4 text-green-700 font-semibold">{result}</p>
      )}

      {/* --- Filler stats box --- */}
      <div className="mt-6 p-4 bg-purple-100 rounded-lg text-purple-700 text-sm">
        <p>🔥 Phrases done: {index}</p>
        <p>🚀 Best Speed: {bestWpm} WPM</p>
        <p className="mt-2 italic">Tip: Sit straight, breathe & type mindfully!</p>
      </div>
    </div>
  );
}
