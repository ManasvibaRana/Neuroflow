import React, { useState } from 'react';
import Timer from './Timer';
import Pomodoro from './Pomodoro';
import MusicPlayer from './MusicPlayer';

function Pomodo() {
  const [mode, setMode] = useState('stopwatch');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold text-gray-700 mb-4">Focus Hub</h1>

      {/* Toggle Pills */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('stopwatch')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'stopwatch'
              ? 'bg-purple-500 text-white'
              : 'bg-purple-200 text-purple-800'
          }`}
        >
          Stopwatch
        </button>
        <button
          onClick={() => setMode('pomodoro')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'pomodoro'
              ? 'bg-purple-500 text-white'
              : 'bg-purple-200 text-purple-800'
          }`}
        >
          Pomodoro
        </button>
      </div>

      {/* Conditional layout */}
      {mode === 'stopwatch' && (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl items-center justify-center transition-all duration-500">
          <div className="w-full md:w-1/2">
            <Timer />
          </div>
          <div className="w-full md:w-1/2">
            <MusicPlayer />
          </div>
        </div>
      )}

      {mode === 'pomodoro' && (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl items-center justify-center transition-all duration-500">
          <div className="w-full md:w-1/2">
            <MusicPlayer />
          </div>
          <div className="w-full md:w-1/2">
            <Pomodoro />
          </div>
        </div>
      )}
    </div>
  );
}

export default Pomodo;
