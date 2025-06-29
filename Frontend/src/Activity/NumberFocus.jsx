import React, { useState, useEffect } from "react";

export default function NumberFocus() {
  const [numbers, setNumbers] = useState([]);
  const [expected, setExpected] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);

  const shuffleNumbers = () => {
    const nums = Array.from({ length: 9 }, (_, i) => i + 1).sort(
      () => 0.5 - Math.random()
    );
    setNumbers(nums);
    setExpected(1);
    setResult(null);
  };

  useEffect(() => {
    shuffleNumbers();
  }, []);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        shuffleNumbers();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const clickNum = (num) => {
    if (num === expected) {
      if (expected === 1) {
        setStartTime(Date.now());
      }
      if (num === 9) {
        const totalTime = Date.now() - startTime;
        setResult(`✅ Well done! You finished in ${totalTime} ms`);
      }
      setExpected(expected + 1);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md transition hover:scale-105">
      <h3 className="text-lg font-bold mb-2 text-purple-600">🔢 Number Focus</h3>
      <p className="text-sm text-purple-800 mb-4">
        Click the numbers in order from 1 to 9 as fast as you can!
      </p>
      <div className="grid grid-cols-3 gap-3">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => clickNum(num)}
            className={`w-16 h-16 rounded-full text-xl font-bold transition ${
              num < expected
                ? "bg-green-300"
                : "bg-purple-300 hover:bg-purple-400"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {result && (
        <p className="mt-4 text-green-700 font-semibold">{result}</p>
      )}
    </div>
  );
}
