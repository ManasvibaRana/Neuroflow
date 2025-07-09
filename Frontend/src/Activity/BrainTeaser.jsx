import React, { useState } from "react";

export default function BrainTeaser() {
  const riddles = [
    { q: "What has keys but can't open locks?", a: "A piano 🎹" },
    { q: "What gets wetter the more it dries?", a: "A towel 🧺" },
    { q: "What has a head and a tail but no body?", a: "A coin 🪙" },
    { q: "I’m tall when I’m young and short when I’m old. What am I?", a: "A candle 🕯️" },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp ✉️" },
    { q: "What has hands but can’t clap?", a: "A clock ⏰" },
    { q: "What can you catch but not throw?", a: "A cold 🤧" },
    { q: "What goes up but never comes down?", a: "Your age 🎂" },
    { q: "What has many teeth but can’t bite?", a: "A comb 💇" },
    { q: "What kind of band never plays music?", a: "A rubber band 🫧" },
  ];

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const next = () => {
    setShow(false);
    setIndex((index + 1) % riddles.length);
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-md text-center transition hover:scale-105 w-full md:col-span-2">
      <h3 className="text-2xl font-bold mb-6 text-purple-600">🧩 Brain Teaser</h3>
      <p className="mb-6 text-gray-800 text-lg">{riddles[index].q}</p>
      {show && (
        <p className="mb-6 text-green-700 text-xl animate-bounce">{riddles[index].a}</p>
      )}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShow(!show)}
          className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600"
        >
          {show ? "Hide" : "Reveal"}
        </button>
        <button
          onClick={next}
          className="bg-gray-300 px-6 py-3 rounded-full hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
