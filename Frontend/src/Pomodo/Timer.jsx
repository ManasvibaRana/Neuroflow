import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import useChimes from '../usechimes';

function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [secondsInput, setSecondsInput] = useState(0);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const { startChimeRef, successChimeRef, errorChimeRef } = useChimes();

  const startTimer = () => {
    const total = hours * 3600 + minutes * 60 + secondsInput;

    if (total <= 0) {
      errorChimeRef.current?.play();
      toast.info("⏰ Please enter a valid time!");
      return;
    }

    startChimeRef.current?.play();
    setDuration(total);
    setSecondsLeft(total);
    setIsActive(true);
  };

  useEffect(() => {
    let interval;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      endChimeRef.current?.play();
      toast.success("⏰ Time's up!");
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const formatTime = () => {
    const h = Math.floor(secondsLeft / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (secondsLeft / duration) * circumference;

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">General Timer</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          min="0"
          value={hours === 0 ? '' : hours}
          onChange={(e) => setHours(+e.target.value)}
          placeholder="HH"
          className="w-16 p-2 border rounded"
        />
        <input
          type="number"
          min="0"
          value={minutes === 0 ? '' : minutes}
          onChange={(e) => setMinutes(+e.target.value)}
          placeholder="MM"
          className="w-16 p-2 border rounded"
        />
        <input
          type="number"
          min="0"
          value={secondsInput === 0 ? '' : secondsInput}
          onChange={(e) => setSecondsInput(+e.target.value)}
          placeholder="SS"
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
          stroke="#60a5fa"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
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
          {formatTime()}
        </text>
      </svg>

      <div className="flex gap-2 mt-4">
        <button onClick={startTimer} className="px-4 py-2 bg-green-200 rounded">
          Start
        </button>
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-yellow-200 rounded"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setHours(0);
            setMinutes(0);
            setSecondsInput(0);
            setSecondsLeft(0);
          }}
          className="px-4 py-2 bg-red-200 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
