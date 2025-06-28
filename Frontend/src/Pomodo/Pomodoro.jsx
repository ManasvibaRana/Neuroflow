import React, { useState, useEffect } from 'react';

export default function Pomodoro() {
  const defaultWork = 25 * 60;
  const defaultShort = 5 * 60;
  const defaultLong = 15 * 60;

  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const [workSeconds, setWorkSeconds] = useState(defaultWork);
  const [shortSeconds, setShortSeconds] = useState(defaultShort);
  const [longSeconds, setLongSeconds] = useState(defaultLong);

  const [currentSeconds, setCurrentSeconds] = useState(defaultWork);
  const [blockDuration, setBlockDuration] = useState(defaultWork);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work | short | long
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    let interval;

    if (isActive && currentSeconds > 0) {
      interval = setInterval(() => {
        setCurrentSeconds((s) => {
          const newS = s - 1;

          if (mode === 'work') setWorkSeconds(newS);
          else if (mode === 'short') setShortSeconds(newS);
          else if (mode === 'long') setLongSeconds(newS);

          return newS;
        });

        if (mode === 'work') {
          setTotalTime((t) => (t > 0 ? t - 1 : 0));
        }
      }, 1000);
    } else if (isActive && currentSeconds === 0) {
      if (mode === 'work') {
        if (totalTime <= 0) {
          alert("🎉 All sessions done!");
          resetAll();
          return;
        }

        if (cycle % 4 === 0) {
          setMode('long');
          setLongSeconds(defaultLong);
          setBlockDuration(defaultLong);
          setCurrentSeconds(defaultLong);
        } else {
          setMode('short');
          setShortSeconds(defaultShort);
          setBlockDuration(defaultShort);
          setCurrentSeconds(defaultShort);
        }
      } else {
        if (mode === 'short' || mode === 'long') {
          setCycle((c) => c + 1);
        }
        // Go back to work block
        setMode('work');
        setWorkSeconds(defaultWork);
        setBlockDuration(defaultWork);
        setCurrentSeconds(defaultWork);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, currentSeconds]);

  const handleStart = () => {
    if (totalTime <= 0) {
      const total = customHours * 3600 + customMinutes * 60;
      if (total <= 0) {
        alert("⏰ Please enter total time!");
        return;
      }
      setTotalTime(total);
    }
    setIsActive(true);
  };

  const handlePause = () => setIsActive(false);

  const resetAll = () => {
    setIsActive(false);
    setCustomHours(0);
    setCustomMinutes(0);
    setTotalTime(0);

    setMode('work');
    setWorkSeconds(defaultWork);
    setShortSeconds(defaultShort);
    setLongSeconds(defaultLong);

    setBlockDuration(defaultWork);
    setCurrentSeconds(defaultWork);
    setCycle(1);
  };

  const handleModeSwitch = (newMode) => {
    setIsActive(false);
    if (newMode === 'work') {
      setMode('work');
      setBlockDuration(defaultWork);
      setCurrentSeconds(workSeconds);
    } else if (newMode === 'short') {
      setMode('short');
      setBlockDuration(defaultShort);
      setCurrentSeconds(shortSeconds);
    } else if (newMode === 'long') {
      setMode('long');
      setBlockDuration(defaultLong);
      setCurrentSeconds(longSeconds);
    }
  };

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (currentSeconds / blockDuration) * circumference;

  const totalCycles = Math.max(1, Math.ceil((customHours * 60 + customMinutes) / 25));

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 max-w-md">
      <h2 className="text-xl font-bold mb-2">Dynamic Pomodoro</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          min="0"
          placeholder="HH"
          value={customHours === 0 ? '' : customHours}
          onChange={(e) => setCustomHours(+e.target.value)}
          className="w-16 p-2 border rounded"
        />
        <input
          type="number"
          min="0"
          placeholder="MM"
          value={customMinutes === 0 ? '' : customMinutes}
          onChange={(e) => setCustomMinutes(+e.target.value)}
          className="w-16 p-2 border rounded"
        />
      </div>

      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#eee"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#a78bfa"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s linear',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-xl font-bold fill-gray-700"
        >
          {format(currentSeconds)}
        </text>
      </svg>

      <div className="text-center mb-4">
        <p><strong>Mode:</strong> {mode.toUpperCase()}</p>
        <p><strong>Cycle:</strong> {cycle} / {totalCycles}</p>
        <p><strong>Total Remaining:</strong> {Math.max(0, Math.ceil(totalTime / 60))} mins</p>
      </div>

      <div className="flex gap-2 mt-2">
        <button onClick={handleStart} className="px-4 py-2 bg-green-200 rounded">
          Start
        </button>
        <button onClick={handlePause} className="px-4 py-2 bg-yellow-200 rounded">
          Pause
        </button>
        <button onClick={resetAll} className="px-4 py-2 bg-red-200 rounded">
          Reset
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={() => handleModeSwitch('work')} className="px-3 py-1 bg-purple-200 rounded">
          Pomodoro
        </button>
        <button onClick={() => handleModeSwitch('short')} className="px-3 py-1 bg-blue-200 rounded">
          Short Break
        </button>
        <button onClick={() => handleModeSwitch('long')} className="px-3 py-1 bg-pink-200 rounded">
          Long Break
        </button>
      </div>
    </div>
  );
}
