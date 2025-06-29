import React, { useState, useEffect } from "react";

export default function BreathingCircle() {
  const [phase, setPhase] = useState("Ready");
  const [scale, setScale] = useState("scale-100");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const phases = ["Inhale", "Hold", "Exhale"];
    const scales = ["scale-150", "scale-150", "scale-100"];
    setPhase(phases[0]);
    setScale(scales[0]);

    const interval = setInterval(() => {
      i++;
      if (i >= phases.length) {
        clearInterval(interval);
        setPhase("Done ✅");
        setScale("scale-100");
        setRunning(false);
      } else {
        setPhase(phases[i]);
        setScale(scales[i]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md text-center transition hover:scale-105">
      <h3 className="text-lg font-bold mb-4 text-purple-600">🌬️ Breathing Circle</h3>
      <div
        className={`w-28 h-28 bg-purple-300 rounded-full mx-auto mb-4 transition-all duration-1000 ${scale}`}
      />
      <p className="mb-4 text-xl text-purple-700">{phase}</p>
      <button
        onClick={() => setRunning(true)}
        disabled={running}
        className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500"
      >
        Start
      </button>
    </div>
  );
}
