import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiPlusCircle,FiAlertTriangle  } from 'react-icons/fi';
import MainNavbar from '../Navbar.jsx'; 
import useChimes from '../usechimes.js'; 
import { toast } from "sonner"; 

// --- MOTIVATIONAL QUOTES ---
const journeyQuotes = [
  { dayAnchor: 2, quote: "The secret of getting ahead is getting started.", offset: { x: 120, y: -60 } },
  { dayAnchor: 6, quote: "A little progress each day adds up to big results.", offset: { x: -150, y: -70 } },
  { dayAnchor: 11, quote: "Don't watch the clock; do what it does. Keep going.", offset: { x: 140, y: -80 } },
  { dayAnchor: 16, quote: "Believe you can and you're halfway there.", offset: { x: -150, y: -90 } },
  { dayAnchor: 20, quote: "Success is the sum of small efforts, repeated daily.", offset: { x: 100, y: 50 } }
];

// --- THEME DATA: To make quests feel different ---
const themes = {
  forest: {
    gradient: 'from-green-100 via-emerald-50 to-green-100',
    pathColor: '#A7F3D0',
    completedPath: ['#34D399', '#10B981'],
    sparkleColor: '#34D399',
    scenery: [
      { type: "tree", dayAnchor: 3, offset: { x: -180, y: 50 }, size: "150px", opacity: 0.7 },
      { type: "tree", dayAnchor: 9, offset: { x: 190, y: 20 }, size: "120px", opacity: 0.6 },
      { type: "mountain", dayAnchor: 15, offset: { x: -150, y: -70 }, size: "250px", opacity: 0.5 },
      { type: "bush", dayAnchor: 1, offset: { x: 150, y: 40 }, size: "70px", opacity: 0.8 },
      { type: "tree", dayAnchor: 18, offset: { x: 200, y: 60 }, size: "140px", opacity: 0.65 },
      { type: "bush", dayAnchor: 12, offset: { x: -200, y: 50 }, size: "80px", opacity: 0.75 },
    ]
  },
  celestial: {
    gradient: 'from-indigo-100 via-slate-50 to-purple-100',
    pathColor: '#E0E7FF',
    completedPath: ['#818CF8', '#A78BFA'],
    sparkleColor: '#A78BFA',
    scenery: [
      { type: "cloud", dayAnchor: 5, offset: { x: 200, y: -20 }, size: "180px", opacity: 0.6, animation: "floatCloud 12s ease-in-out infinite" },
      { type: "cloud", dayAnchor: 12, offset: { x: -220, y: -10 }, size: "200px", opacity: 0.5, animation: "floatCloud 15s ease-in-out infinite" },
      { type: "star", dayAnchor: 2, offset: { x: -100, y: -80 }, size: "40px", opacity: 0.8, animation: "twinkle 2s ease-in-out infinite" },
      { type: "star", dayAnchor: 8, offset: { x: 80, y: -120 }, size: "30px", opacity: 0.7, animation: "twinkle 2.5s ease-in-out infinite" },
      { type: "moon", dayAnchor: 17, offset: { x: 150, y: -100 }, size: "100px", opacity: 0.6 },
      { type: "flag", dayAnchor: 20, offset: { x: 50, y: -80 }, size: "120px", opacity: 0.7, animation: "waveFlag 3s ease-in-out infinite" },
    ]
  },
  ocean: {
    gradient: 'from-cyan-100 via-white to-blue-100',
    pathColor: '#A5F3FC',
    completedPath: ['#22D3EE', '#0EA5E9'],
    sparkleColor: '#22D3EE',
    scenery: [
       { type: "cloud", dayAnchor: 4, offset: { x: 180, y: -30 }, size: "160px", opacity: 0.6, animation: "floatCloud 14s ease-in-out infinite" },
       { type: "sun", dayAnchor: 8, offset: { x: -220, y: -100 }, size: "120px", opacity: 0.7 },
       { type: "wave", dayAnchor: 1, offset: { x: 0, y: 80 }, size: "300px", opacity: 0.4 },
       { type: "wave", dayAnchor: 12, offset: { x: 10, y: 80 }, size: "350px", opacity: 0.3 },
       { type: "boat", dayAnchor: 15, offset: { x: -150, y: -30 }, size: "110px", opacity: 0.8 },
       { type: "flag", dayAnchor: 20, offset: { x: -80, y: -60 }, size: "110px", opacity: 0.7, animation: "waveFlag 4s ease-in-out infinite" },
    ]
  },
  adventure: { // For custom quests
    gradient: 'from-amber-100 via-white to-lime-100',
    pathColor: '#FEF3C7',
    completedPath: ['#F59E0B', '#84CC16'],
    sparkleColor: '#F59E0B',
    scenery: [
      { type: "signpost", dayAnchor: 1, offset: { x: 150, y: 10 }, size: "90px", opacity: 0.8 },
      { type: "crystal", dayAnchor: 7, offset: { x: -180, y: -40 }, size: "70px", opacity: 0.7, animation: "floatCloud 8s ease-in-out infinite" },
      { type: "pennant", dayAnchor: 11, offset: { x: 180, y: -50 }, size: "100px", opacity: 0.8, animation: "waveFlag 3s ease-in-out infinite" },
      { type: "crystal", dayAnchor: 16, offset: { x: 160, y: -30 }, size: "60px", opacity: 0.6, animation: "floatCloud 10s ease-in-out infinite" },
      { type: "flag", dayAnchor: 20, offset: { x: 50, y: -80 }, size: "120px", opacity: 0.7, animation: "waveFlag 3s ease-in-out infinite" },
    ]
  }
};

const TrophySVG = ({ size, className }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5 16.25L12 14.5L8.5 16.25L9.25 12.5L6.5 10L10.25 9.5L12 6L13.75 9.5L17.5 10L14.75 12.5L15.5 16.25Z" />
    </svg>
);

// Add this after the TrophySVG component
function ConfirmRestartModal({ questName, onConfirm, onCancel }) {
  return (
    <ModalBackdrop onClick={onCancel}>
      <ModalContent className="text-center">
        <FiAlertTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Restart Quest?
        </h2>
        <p className="text-slate-600 mb-6">
          Restarting the <span className="font-bold">{questName}</span> quest will permanently erase all its previous log entries.
          <br />
          Are you sure you want to start a fresh journey?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Confirm & Restart
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

function ConfirmAbandonModal({ questName, onConfirm, onCancel }) {
  return (
    <ModalBackdrop onClick={onCancel}>
      <ModalContent className="text-center">
        <FiAlertTriangle className="text-5xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Abandon Quest?
        </h2>
        <p className="text-slate-600 mb-6">
          Are you sure you want to abandon the <span className="font-bold">{questName}</span> quest? All progress will be permanently deleted.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Yes, Abandon
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}


// --- PRE-DEFINED & CUSTOM HABIT DATA ---
const habitPacks = {
  fitness: {
    id: 'fitness',
    name: 'Fitness Quest',
    description: 'Forge discipline and sculpt your physique.',
    avatar: '🏋️',
    theme: 'forest',
    milestones: {
      7: { name: 'You Got This', image: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmk1dzhmbHdrMWU4bjZkY2RjeDBmcnN5c2dxcjAxdzJqZzlrdW5xZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kkNZS8DDB9rfxVwlLP/giphy.gif" },
      14: { name: 'GO GO GO', image: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnNpcHVjbmE1czhrcjFvbTBtanJkeGFsNzFrZzU5Z205ZTMyZXQxeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BmJ1lwCs4JhYdLAnP0/giphy.gif' },
      20: { name: 'You did it', image: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN200a3l4dmkyamNuYjd4b3ZicXVibzMwOGxpbXBkNmhtdGxtZnAybCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/94TZ04Ob9M8olunn15/giphy.gif' },
    },
  },
  reading: {
    id: 'reading',
    name: 'Reading Odyssey',
    description: 'Journey through new worlds and expand your mind.',
    avatar: '📚',
    theme: 'celestial',
    milestones: {
      7: { name: 'The First Chapter', image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BiaG9pNmgzOXVqdGMybW5nN3g0Znd3MGhybmIxNXF2NzAxcjg4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11I8v5lE8uq79C/giphy.gif' },
      14: { name: 'Into the Adventure', image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzA5bXpnZmVnZTcwa3c2dm5xaWhqejhzdXF5N2NqMTRtZTE0dXU5aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0LIY3oLaVRSDQFgAnc/giphy.gif' },
      20: { name: 'Congratulations, Bookworm!', image: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWU1djFiZHQwcm5wd2l6dHRrYXVjdXJlbGkxcGJwZnN2NDdhM3ZkNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M2S53Vo059qC4mZSOJ/giphy.gif' },
    },
  },
  mindfulness: {
    id: 'mindfulness',
    name: 'Path of Presence',
    description: 'Cultivate inner calm and sharpen your focus.',
    avatar: '🧘',
    theme: 'ocean',
    milestones: {
      7: { name: 'Keep Calm', image: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW01dWFqaTJhbTl4YXluaWRjaHp4ZzR6a2JjYmFjZzV2NmVnMHc3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h5jENMUAFlJxz0YDMk/giphy.gif' },
      14: { name: 'Mystic Opening', image: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTljaHQ2N2U3cXdsam9hbW9jMzJocmYxYWZrNWowOThqYXB3OW85cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8pO7dRSJRxigBSLKF/giphy.gif' },
      20: { name: 'Peak Serenity', image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmljaHRpejBkdWFwaG05dmYxM3k2Nm14eXFxcmpqOG1vNW55NTBiciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/209KCwPntVIHsr5iIy/giphy.gif' },
    },
  },
};

const getPackDetails = (habit) => {
    if (!habit) return null;

    if (habitPacks[habit.pack_id]) {
        return habitPacks[habit.pack_id];
    }

    // For custom quests
    return {
        name: habit.name || "Custom Quest",
        description: habit.description || "A personalized journey.",
        avatar: habit.avatar || '🎯',
        milestones: {
            7: { name: 'Week 1 Complete!', image: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZtcHEweTNrNnRvMG14NWVrcTVtMzdxOHl1eHl6YWFjaWk2aXlqMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/c1AfqKTvATepFDTpnY/giphy.gif' },
            14: { name: 'Two Weeks Strong!', image: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTRvazBwOGg2NnZ6aGl6NmhzejBqNjJydWh6cHVmcjRjczBpOTdwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xHMIDAy1qkzNS/giphy.gif' },
            20: { name: 'One day to Go!', image: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczB4a3U4cWd4MDJxaDNqZnNneWhsZHR5aHF5OTFwcXR3ZGwyemV2MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KhnLVzqg1jtjZs2TIZ/giphy.gif' }
        },
        theme: habit.theme || 'adventure' // Use new 'adventure' theme for custom quests
    };
};

const launchConfetti = () => confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

// --- DECORATIVE & SVG COMPONENTS ---

// ... (AuroraBackground and CursorGlow remain the same)
function AuroraBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute w-[900px] h-[900px] -left-[400px] -top-[400px] bg-purple-400/30 rounded-full blur-3xl animate-aurora-1"></div>
      <div className="absolute w-[800px] h-[800px] -right-[300px] -top-[200px] bg-fuchsia-400/30 rounded-full blur-3xl animate-aurora-2"></div>
      <div className="absolute w-[600px] h-[600px] left-[200px] bottom-[-200px] bg-indigo-400/30 rounded-full blur-3xl animate-aurora-3"></div>
    </div>
  );
}

const CursorGlow = React.memo(() => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      className="pointer-events-none fixed -z-10"
      style={{
        top: pos.y, left: pos.x, width: 400, height: 400,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)',
        filter: 'blur(60px)'
      }}
    />
  );
});

// ... (Sparkles remains the same)
const Sparkles = React.memo(({ density = 15, color = '#A855F7', minSize = 8, maxSize = 18, fadeOut = true }) => {
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const s = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: minSize + Math.random() * (maxSize - minSize)
      };
      setSparkles(p => [...p, s]);
      if(fadeOut) {
        setTimeout(() => setSparkles(p => p.filter(sp => sp.id !== s.id)), 1200);
      }
    }, 1000 / density);
    return () => clearInterval(interval);
  }, [density, color, fadeOut, minSize, maxSize]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ top: s.y, left: s.x, width: s.size, height: s.size }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 1.2 }}
        >
          <FiStar className="w-full h-full drop-shadow-md" style={{ color }} />
        </motion.div>
      ))}
    </div>
  );
});

// --- Existing and New SVG Components ---
const MountainSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
    <path d="M6.5,93.5 C25,70 33,65 45,80 L60,55 L75,85 C85,70 90,75 93.5,93.5 Z" fill="#a8b2c4" />
    <path d="M25,93.5 C35,80 45,85 55,70 L65,85 C75,75 80,80 85,93.5 Z" fill="#8d99ae" />
    <path d="M48,55 L60,30 L72,55 L60,45 Z" fill="#f0f4f8" />
  </svg>
);
const TreeSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <path d="M 32,54 L 32,34" stroke="#8B5E3C" strokeWidth="8" strokeLinecap="round" />
    <path d="M 12,40 Q 32,10 52,40 Z" fill="#4ADE80" />
    <path d="M 18,30 Q 32,0 46,30 Z" fill="#2F855A" />
  </svg>
);
const CloudSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 60" style={{ opacity }}>
    <path d="M 10,60 A 20,20 0,1,1 50,60" fill="#E5E7EB" />
    <path d="M 30,60 A 25,25 0,1,1 80,60" fill="#E5E7EB" />
    <path d="M 50,60 A 20,20 0,1,1 90,60" fill="#E5E7EB" />
  </svg>
);
const FlagSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <rect x="14" y="10" width="4" height="44" fill="#374151" rx="2" />
    <polygon points="18,12 48,22 18,32" fill="#EF4444" />
  </svg>
);
const BushSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <circle cx="22" cy="40" r="15" fill="#34D399" />
    <circle cx="42" cy="40" r="18" fill="#10B981" />
  </svg>
);
const StarSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FBBF24" />
  </svg>
);
const MoonSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <path d="M21.64 13.5A9.99999 9.99999 0 0110.5 2.36A10.00002 10.00002 0 0021.64 13.5z" fill="#F3F4F6" />
  </svg>
);
const SunSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24" style={{ opacity }}>
    <circle cx="12" cy="12" r="6" />
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const WaveSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 20" style={{ opacity }}>
    <path d="M 0 10 Q 25 20, 50 10 T 100 10" stroke="#38BDF8" strokeWidth="3" fill="none" />
    <path d="M 0 15 Q 25 25, 50 15 T 100 15" stroke="#7DD3FC" strokeWidth="3" fill="none" />
  </svg>
);
const BoatSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <path d="M 10 40 Q 32 55, 54 40 L 48 50 L 16 50 Z" fill="#A16207" />
    <rect x="30" y="10" width="4" height="30" fill="#374151" />
    <polygon points="34,12 50,18 34,24" fill="#F1F5F9" />
  </svg>
);
const SignpostSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <rect x="29" y="30" width="6" height="28" fill="#A16207" />
    <rect x="10" y="10" width="44" height="18" fill="#F59E0B" rx="2"/>
    <text x="32" y="24" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">21 Days</text>
  </svg>
);
const PennantSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <rect x="14" y="10" width="4" height="44" fill="#6B7280" rx="2" />
    <polygon points="18,12 54,26 18,40" fill="#84CC16" />
  </svg>
);
const CrystalSVG = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ opacity }}>
    <path d="M32 4 L16 24 L32 60 L48 24 Z" fill="#A78BFA" />
    <path d="M32 4 L16 24 L32 28 Z" fill="#C4B5FD" />
    <path d="M32 4 L48 24 L32 28 Z" fill="#818CF8" />
  </svg>
);

const sceneryComponents = {
    mountain: MountainSVG,
    tree: TreeSVG,
    cloud: CloudSVG,
    flag: FlagSVG,
    bush: BushSVG,
    star: StarSVG,
    moon: MoonSVG,
    sun: SunSVG,
    wave: WaveSVG,
    boat: BoatSVG,
    signpost: SignpostSVG,
    pennant: PennantSVG,
    crystal: CrystalSVG,
};

// ... (CompletedQuestModal remains the same)
function CompletedQuestModal({ quest, onViewPast, onRestart, onClose }) {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent className="text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Quest Completed
        </h2>
        <p className="text-slate-600 mb-6">
          You’ve already completed <span className="font-bold">{quest.name}</span>.  
          Would you like to view your past journey or start a new cycle?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onViewPast(quest)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            View Past Journey
          </button>
          <button
            onClick={() => onRestart(quest)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Restart Quest
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 transition"
          >
            Cancel
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

// --- MAIN APP COMPONENT ---
// ... (HabitJourneyApp remains largely the same, only getPackDetails default theme changes)
export default function HabitJourneyApp() {
  const [allHabits, setAllHabits] = useState([]);
  const [activeHabit, setActiveHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { startChimeRef, successChimeRef, errorChimeRef } = useChimes();

  const fetchHabits = async () => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/habit/habits/?user_id=${userId}`, {
          cache: 'no-cache',
      });
      const data = await res.json();
      
      console.log("1. [fetchHabits] Data received from server:", data);

      setAllHabits(data || []);
      const currentHabit = data.find(h => !h.completed);

      console.log("2. [fetchHabits] Found active habit:", currentHabit);

      setActiveHabit(currentHabit || null);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

const handleStart = async (packData) => {
  // If we are just viewing a past completed quest (read-only mode)
  if (packData.viewMode) {
    // Find the matching past habit from completed ones
    const pastHabit = allHabits.find(
      h => h.pack_id === packData.pack_id && h.completed
    );
    if (pastHabit) {
      setActiveHabit({...pastHabit, viewMode: true});
    } else {
      console.warn("Past habit not found for viewing.");
    }
    return;
  }

  const userId = sessionStorage.getItem("userid");

  if (!userId) {
    console.error("No user_id found in sessionStorage. Cannot start habit.");
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/habit/habits/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        ...packData // contains pack_id, name, description, avatar, theme
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (err.detail === "An active habit already exists.") {
        toast.info("You already have a quest in progress! You must complete or abandon it before starting a new one.");
        errorChimeRef.current?.play();
      }
      throw new Error(err.detail || "Failed to create habit.");
    }

    const newHabit = await res.json();
    setActiveHabit(newHabit);
    setAllHabits(prev => [newHabit, ...prev]);
    startChimeRef.current?.play();
  } catch (err) {
    console.error("Habit creation failed:", err);
  }
};

const handleAbandon = async (habitId) => {
  const userId = sessionStorage.getItem('userid');

  if (!userId) {
    console.error("No user_id found in sessionStorage. Cannot delete habit.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/habit/habits/${habitId}/?user_id=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(`Failed to abandon habit: ${response.status}`);
      return;
    }

    // Refresh the habits list after deletion
    fetchHabits();

  } catch (error) {
    console.error("Failed to abandon habit due to a network error:", error);
  }
};

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><p className="text-purple-600 font-medium">Loading your journey...</p></div>;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      <MainNavbar />
      <AuroraBackground />
      <CursorGlow />
      <AnimatePresence mode="wait">
        {!activeHabit ? (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HabitSetup onStart={handleStart} allHabits={allHabits} />
          </motion.div>
        ) : (
          <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <JourneyMap
                habit={activeHabit}
                onUpdate={setActiveHabit}
                onComplete={() => {
                    setActiveHabit(null);
                    fetchHabits();
                }}
                onAbandon={handleAbandon}
                successChimeRef={successChimeRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SCREEN COMPONENTS ---
function HabitSetup({ onStart, allHabits }) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [selectedCompletedQuest, setSelectedCompletedQuest] = useState(null);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [questToRestart, setQuestToRestart] = useState(null);
  const completedIds = new Set(allHabits.filter(h => h.completed).map(h => h.pack_id));

  const customQuests = allHabits.filter(h => h.pack_id.startsWith("custom_"));

  const handleRestart = async (quest) => {
      const userId = sessionStorage.getItem("userid");
      if (!userId) {
          console.error("No user ID found.");
          return;
      }

      const habitInstance = allHabits.find(h => h.pack_id === quest.pack_id && h.completed);
      if (!habitInstance) {
          console.error("Could not find the completed habit instance to restart.");
          return;
      }

      try {
          const res = await fetch(`http://127.0.0.1:8000/api/habit/habits/${habitInstance.id}/restart/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.detail || "Failed to restart quest.");
          }
          
          window.location.reload(); 

      } catch (err) {
          console.error("Quest restart failed:", err);
      }
  };

  const handleCustomStart = (customData) => {
    onStart({
      pack_id: `custom_${Date.now()}`,
      ...customData,
      theme: 'adventure'
    });
    setCustomModalOpen(false);
  };

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-3xl p-8 space-y-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl z-10"
        >
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-purple-700 text-center">The 21-Day Journey</h1>
            <p className="text-purple-900/70 mt-2 text-lg text-center">Choose your next quest or create your own.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* --- Predefined Quests --- */}
            {Object.values(habitPacks).map((pack) => {
              const isCompleted = completedIds.has(pack.id);
              return (
                <motion.button
                  key={pack.id}
                onClick={() => {
                  if (isCompleted) {
                    setSelectedCompletedQuest({
                      name: pack.name,
                      description: pack.description,
                      avatar: pack.avatar,
                      theme: pack.theme,
                      pack_id: pack.id
                    });
                  } else {
                    onStart({
                      pack_id: pack.id,
                      name: pack.name,
                      description: pack.description,
                      avatar: pack.avatar,
                      theme: pack.theme
                    });
                  }
                }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="relative p-6 bg-white/70 rounded-2xl border text-center transition-colors group shadow-lg"
                >
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">✓</div>
                  )}
                  <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{pack.avatar}</div>
                  <h2 className="font-semibold text-lg text-purple-800">{pack.name}</h2>
                  <p className="text-sm text-purple-900/60 mt-1">{pack.description}</p>
                </motion.button>
              );
            })}

            {/* --- Past Custom Quests --- */}
            {customQuests.map((quest) => (
              <motion.button
                key={quest.pack_id}
                onClick={() => {
                  if (quest.completed) {
                    setSelectedCompletedQuest({
                      name: quest.name,
                      description: quest.description,
                      avatar: quest.avatar,
                      theme: quest.theme,
                      pack_id: quest.pack_id,
                    });
                  }
                }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="relative p-6 bg-white/70 rounded-2xl border text-center transition-colors group shadow-lg"
              >
                {quest.completed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">✓</div>
                )}
                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{quest.avatar}</div>
                <h2 className="font-semibold text-lg text-purple-800">{quest.name}</h2>
                <p className="text-sm text-purple-900/60 mt-1">{quest.description}</p>
              </motion.button>
            ))}

            {/* --- Create New Custom Quest --- */}
            <motion.button
              onClick={() => setCustomModalOpen(true)}
              whileHover={{ y: -5, scale: 1.05 }}
              className="p-6 bg-purple-50/70 rounded-2xl border border-dashed border-purple-400 text-center flex flex-col items-center justify-center transition-colors group shadow-lg"
            >
              <FiPlusCircle className="text-5xl mb-3 text-purple-600 transition-transform duration-300 group-hover:scale-110"/>
              <h2 className="font-semibold text-lg text-purple-800">Create Your Own</h2>
              <p className="text-sm text-purple-900/60 mt-1">Design a personal quest.</p>
            </motion.button>

          </div>
        </motion.div>
      </div>

      {/* --- Modal Management --- */}
      <AnimatePresence>
        {customModalOpen && <CustomQuestModal onStart={handleCustomStart} onClose={() => setCustomModalOpen(false)} />}

        {selectedCompletedQuest && (
          <CompletedQuestModal
            quest={selectedCompletedQuest}
            onClose={() => setSelectedCompletedQuest(null)}
            onViewPast={() => {
              onStart({ ...selectedCompletedQuest, viewMode: true });
              setSelectedCompletedQuest(null);
            }}
            onRestart={() => {
              setQuestToRestart(selectedCompletedQuest);
              setShowConfirmRestart(true);
              setSelectedCompletedQuest(null);
            }}
          />
        )}

        {showConfirmRestart && questToRestart && (
            <ConfirmRestartModal 
                questName={questToRestart.name}
                onCancel={() => setShowConfirmRestart(false)}
                onConfirm={() => {
                    handleRestart(questToRestart);
                    setShowConfirmRestart(false);
                }}
            />
        )}
      </AnimatePresence>
    </>
  );
}


function JourneyMap({ habit, onUpdate, onComplete, onAbandon, successChimeRef }) {
  const totalDays = 21;
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [pathData, setPathData] = useState({ d: '', length: 0 });
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const mapRef = useRef(null);
  const pathPoints = useRef([]);
  
  const pack = getPackDetails(habit);
  const theme = themes[pack.theme];

  const activeDayRef = useCallback(node => {
    if (node !== null) {
        const timer = setTimeout(() => {
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }, 400); 
        
        return () => clearTimeout(timer);
    }
  }, []);

// --- CORRECTED CODE ---

// This effect handles showing the 'Quest Rules' modal.
// It runs only when the 'habit' object changes.
useEffect(() => {
    if (
        habit &&
        new Date(habit.start_date).toDateString() === new Date().toDateString() &&
        habit.current_day === 0 &&
        !habit.reset // ✅ Prevent showing on restart
    ) {
        setActiveModal('questRules');
    }
}, [habit]);

// This effect handles the visual layout and path drawing.
// It runs when the component mounts and whenever the current day changes.
useLayoutEffect(() => {
    if (!mapRef.current) return;

    const mapWidth = mapRef.current.offsetWidth;
    const mapHeight = mapRef.current.offsetHeight;
    const nodesPerRow = 3;
    const horizontalGap = mapWidth / (nodesPerRow + 1);
    const verticalGap = 220;
    const bottomPadding = 150;
    let points = [];

    for (let i = 0; i < totalDays; i++) {
        const row = Math.floor(i / nodesPerRow);
        const col = i % nodesPerRow;
        const xOffset = Math.sin(i / 2) * 20;
        let x = (row % 2 === 0) ? horizontalGap * (col + 1) : mapWidth - (horizontalGap * (col + 1));
        x += xOffset;
        const y = mapHeight - (row * verticalGap) - bottomPadding;
        points.push({ x, y });
    }
    pathPoints.current = points;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = (i > 0) ? points[i - 1] : points[0];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = (i !== points.length - 2) ? points[i + 2] : p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempPath.setAttribute("d", d);
    const length = tempPath.getTotalLength();
    setPathData({ d, length });

    const progress = habit.current_day > 0 ? Math.min(habit.current_day, totalDays - 1) / (totalDays - 1) : 0;
    const currentPoint = tempPath.getPointAtLength(length * progress);
    setPlayerPos({ x: currentPoint.x, y: currentPoint.y });

}, [habit.current_day, totalDays]); // Dependency array is correct for this hook

  const handleCompleteDay = async (journalText) => {
    const oldLives = habit.lives;
    const nextDay = habit.current_day + 1;
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/habit/habits/${habit.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_day: nextDay,
                journal: [{ day: habit.current_day, entry: journalText }]
            })
        });

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.detail || "An error occurred while logging your day.");
        }
        
        const updatedHabit = responseData;

        onUpdate(updatedHabit);
        // ✅ Show quest completion modal
        if (updatedHabit.completed) {
            setActiveModal('questComplete');
            return;
        }
        setActiveModal(null);

        // Check if the quest was reset by the backend
       // ✅ Life gain / milestone separation
        if (updatedHabit.reset) {
            setActiveModal('gameOver');
            return;
        } else if (updatedHabit.lives > oldLives) {
            setModalData({ type: 'lifeGain' });
            setTimeout(() => setActiveModal('lifeGain'), 300);
        } else if (
            pack.milestones &&
            pack.milestones[nextDay] &&
            updatedHabit.lives === oldLives // milestone modal only if no life gain
        ) {
            setModalData({ day: nextDay });
            setTimeout(() => setActiveModal('milestone'), 800);
        } else if (updatedHabit.lives < oldLives) {
            setModalData({ type: 'lifeLoss' });
            setTimeout(() => setActiveModal('lifeLoss'), 300);
        }

        // ✅ Game Over check
        if (updatedHabit.current_day === 0 && updatedHabit.lives === 3 && oldLives > 0) {
            setActiveModal('gameOver');
            return;
        }
    } catch (err) {
        console.error("Failed to update habit:", err);
        toast.info(`Error: ${err.message}`);
        errorChimeRef.current?.play();
        setActiveModal(null);
    }
  };
  
  const progress = habit.current_day > 0 ? Math.min(habit.current_day, totalDays - 1) / (totalDays - 1) : 0;
  const strokeDashoffset = pathData.length * (1 - progress);

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col relative bg-gradient-to-b ${theme.gradient} overflow-hidden`}>
        <Sparkles density={20} color={theme.sparkleColor} fadeOut={true} />
        <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
          <div className="text-center mb-0 relative z-20 pt-12">
              <div className="flex justify-center items-center space-x-1 mb-2">
                  <div className="fixed top-4 right-4 z-[9999] bg-white shadow-lg rounded-full px-3 py-2 flex space-x-1 border border-gray-200">
                      <p className="font-semibold text-slate-800">Lives: </p>
                      {Array.from({ length: 3 }).map((_, index) => (
                          <motion.span
                              key={index}
                              initial={{ scale: 0.8, opacity: 0.7 }}
                              animate={{
                                  scale: index < habit.lives ? 1.2 : 0.8,
                                  opacity: index < habit.lives ? 1 : 0.3
                              }}
                              transition={{ duration: 0.3 }}
                              className={index < habit.lives ? 'text-red-500' : 'text-gray-300'}
                          >
                              ❤️
                          </motion.span>
                      ))}
                  </div>
              </div>
              <h2 className="font-semibold text-slate-800 text-xl">{pack.name}</h2>
              <p className="text-sm text-slate-500">
                Day {Math.min(habit.current_day + 1, totalDays)} / {totalDays}
              </p>

              {activeModal === 'questComplete' && (
                  <ModalBackdrop onClick={() => setActiveModal(null)}>
                      <ModalContent className="text-center">
                          <h2 className="text-3xl font-bold text-purple-600">🎉 Quest Completed!</h2>
                          <p className="text-slate-600 mb-4">Congratulations! You reached Day 21 and finished your journey!</p>
                          <button
                              onClick={() => window.location.reload()}
                              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                              Start New Quest
                          </button>
                      </ModalContent>
                  </ModalBackdrop>
              )}

              {activeModal === 'questRules' && (
                  <ModalBackdrop onClick={() => setActiveModal(null)}>
                      <ModalContent className="text-center max-w-md">
                          <h2 className="text-2xl font-bold text-blue-600">📜 Quest Rules</h2>
                          <ul className="text-left text-slate-700 mt-3 list-disc list-inside">
                              <li>You have 3 ❤️ lives for the whole 21-day quest.</li>
                              <li>Miss a day = lose 1 ❤️.</li>
                              <li>Lose all ❤️ and you restart from Day 1.</li>
                              <li>Milestones (Day 7, 14, 20) may give you a ❤️ if you have less than 3.</li>
                              <li>Complete all 21 days to finish the quest!</li>
                          </ul>
                          <button
                              onClick={() => setActiveModal(null)}
                              className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                          >
                              Let’s Go!
                          </button>
                      </ModalContent>
                  </ModalBackdrop>
              )}
          
              {habit.viewMode && (
                <div className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg inline-block">
                  Viewing past journey — This quest is complete.
                </div>
              )}

              <div className="mt-3 space-x-2">
                  <button
                    onClick={() => setActiveModal('logbook')}
                    className="px-4 py-2 text-sm bg-purple-100 text-purple-700 font-semibold rounded-lg"
                  >
                    📖 Logbook
                  </button>
                  
                  {!habit.completed && !habit.viewMode && (
                    <button
                      onClick={() => setShowAbandonConfirm(true)}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 font-semibold rounded-lg"
                    >
                      Abandon Quest
                    </button>
                  )}

                  {(habit.completed || habit.viewMode) && (
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 font-semibold rounded-lg"
                    >
                      Return to Quest Selection
                    </button>
                  )}
              </div>
          </div>
            <main className="flex-grow relative z-10">
                <div ref={mapRef} className="relative w-full max-w-2xl mx-auto" style={{ minHeight: `${(totalDays / 3) * 220 + 300}px` }}>
                    <svg className="absolute top-0 left-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.3))' }}>
                        <path d={pathData.d} fill="none" stroke={theme.pathColor} strokeWidth="8" />
                        <path d={pathData.d} fill="none" stroke="url(#gradient-path)" strokeWidth="8" strokeDasharray={pathData.length} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                        <defs>
                            <linearGradient id="gradient-path" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor={theme.completedPath[0]} />
                                <stop offset="100%" stopColor={theme.completedPath[1]} />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    {/* --- Scenery --- */}
                    {theme.scenery.map((prop, i) => {
                        const point = pathPoints.current[prop.dayAnchor] || {x: 0, y: 0};
                        const style = {
                            position: "absolute",
                            top: `${point.y + prop.offset.y}px`,
                            left: `${point.x + prop.offset.x}px`,
                            transform: "translate(-50%, -50%)",
                            animation: prop.animation || 'none'
                        };
                        const Component = sceneryComponents[prop.type];
                        return Component ? <div key={`scenery-${i}`} style={style}><Component size={prop.size} opacity={prop.opacity} /></div> : null;
                    })}

                    {/* --- Quotes --- */}
                    {journeyQuotes.map((quote, i) => {
                      const point = pathPoints.current[quote.dayAnchor] || {x: 0, y: 0};
                      const style = {
                        position: "absolute",
                        top: `${point.y + quote.offset.y}px`,
                        left: `${point.x + quote.offset.x}px`,
                        transform: "translate(-50%, -50%)",
                      };
                      return (
                          <motion.div 
                            key={`quote-${i}`} 
                            style={style} 
                            className="w-48 text-center text-sm text-purple-900/50 font-medium italic"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.2}}
                          >
                            "{quote.quote}"
                          </motion.div>
                      );
                    })}

                    {pathPoints.current.map((point, i) => {
                      const dayNumber = i + 1;
                      const isCompleted = i < habit.current_day;
                      const isActive = i === habit.current_day && i < totalDays && !habit.completed && !habit.viewMode;
                      const isMilestone = pack.milestones && pack.milestones[dayNumber];
                      
                      const baseClasses = "w-14 h-14 flex items-center justify-center rounded-full border-4 shadow-lg transition-all duration-300 transform";
                      const stateClasses = isCompleted 
                        ? 'bg-green-500 text-white' 
                        : (i === habit.current_day && habit.completed) // Final day when completed
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-purple-700';
                      
                      return (
                          <div 
                              key={i} 
                              ref={isActive ? activeDayRef : null}
                              style={{ left: point.x, top: point.y }} 
                              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            >
                              {isMilestone && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                                        <TrophySVG
                                            size="32"
                                            className={`${
                                                isCompleted ? 'text-yellow-500 opacity-70' : 'text-yellow-400 animate-trophy-pulse'
                                            }`}
                                        />
                                    </div>
                                )}
                              {isActive ? (
                                  <motion.div
                                    onClick={() => setActiveModal('journal')}
                                    className={`${baseClasses} bg-purple-600 text-white cursor-pointer`}
                                    animate={{
                                      scale: [1, 1.1, 1],
                                      boxShadow: [
                                        "0 0 0px 0px rgba(168, 85, 247, 0.7)",
                                        "0 0 0px 10px rgba(168, 85, 247, 0)",
                                        "0 0 0px 0px rgba(168, 85, 247, 0.7)"
                                      ]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                  >
                                    <span className="font-bold text-lg">{i + 1}</span>
                                  </motion.div>
                              ) : (
                                  <div className={`${baseClasses} ${stateClasses}`}>
                                    <span className="font-bold text-lg">{isCompleted ? '✓' : i + 1}</span>
                                  </div>
                              )}
                          </div>
                      );
                    })}
                    <motion.div
                        className="absolute z-20 text-4xl"
                        style={{ transform: 'translate(-50%, -120%)' }}
                        animate={{ x: playerPos.x, y: playerPos.y }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      {pack.avatar}
                    </motion.div>
                </div>
            </main>
        </div>
        <AnimatePresence>
            {activeModal && (
                <ModalBackdrop onClick={() => setActiveModal(null)}>
                    {activeModal === 'journal' && <JournalModal day={habit.current_day} onClose={() => setActiveModal(null)} onComplete={handleCompleteDay} />}
                    {activeModal === 'milestone' && <MilestoneModal milestone={pack.milestones[modalData.day]} onClose={() => setActiveModal(null)} />}
                    {activeModal === 'logbook' && <LogbookModal habit={habit} onClose={() => setActiveModal(null)} />}
                    {activeModal === 'journeyComplete' && <JourneyCompleteModal packName={pack.name} onStartNew={onComplete} onClose={onComplete} />}
                </ModalBackdrop>
            )}
                {activeModal === 'lifeGain' && (
                    <ModalBackdrop onClick={() => setActiveModal(null)}>
                        <ModalContent className="text-center">
                            <h2 className="text-2xl font-bold text-green-600">+1 Life!</h2>
                            <p className="text-slate-600">Milestone reached — you’ve earned a heart ❤️</p>
                        </ModalContent>
                    </ModalBackdrop>
                )}

                {activeModal === 'lifeLoss' && (
                    <ModalBackdrop onClick={() => setActiveModal(null)}>
                        <ModalContent className="text-center">
                            <h2 className="text-2xl font-bold text-red-600">Life Lost 💔</h2>
                            <p className="text-slate-600">You missed a day! Only {habit.lives} lives left.</p>
                        </ModalContent>
                    </ModalBackdrop>
                )}

                {activeModal === 'gameOver' && (
                    <ModalBackdrop onClick={() => setActiveModal(null)}>
                        <ModalContent className="text-center">
                            <h2 className="text-3xl font-bold text-red-600">Game Over!</h2>
                            <p className="text-slate-600 mb-4">You ran out of lives. Your quest has been reset to Day 1.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Start Again
                            </button>
                        </ModalContent>
                    </ModalBackdrop>
                )}

             {showAbandonConfirm && (
                <ConfirmAbandonModal
                    questName={pack.name}
                    onConfirm={() => {
                        onAbandon(habit.id);
                        setShowAbandonConfirm(false);
                    }}
                    onCancel={() => setShowAbandonConfirm(false)}
                />
            )}
        </AnimatePresence>
    </div>
  );
}

// --- MODAL COMPONENTS ---
const ModalBackdrop = ({ children, onClick }) => (
  <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClick}>
    {children}
  </motion.div>
);



const ModalContent = ({ children, className }) => (
  <motion.div
    className={`relative bg-white/80 backdrop-blur-2xl border border-purple-200/50 shadow-2xl shadow-purple-400/20 ring-2 ring-purple-300/30 rounded-2xl p-6 w-full max-w-md text-slate-800 ${className} overflow-hidden`}
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-400 to-purple-500"></div>
    {children}
  </motion.div>
);

function JournalModal({ day, onClose, onComplete }) {
  const [text, setText] = useState('');
  return (
    <ModalContent>
      <h2 className="text-2xl font-bold text-purple-700 mb-4 pt-2">Day {day + 1} Log</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="How did it go? What did you learn?"
        className="w-full h-36 p-3 bg-purple-50/50 border border-purple-200 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-slate-700 resize-none"></textarea>
      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition">Cancel</button>
        <button onClick={() => onComplete(text)} className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Complete Day</button>
      </div>
    </ModalContent>
  );
}

function MilestoneModal({ milestone, onClose }) {
  return (
    <ModalContent className="text-center max-w-sm">
      <h2 className="text-3xl font-bold text-yellow-500 mb-2 pt-2">🎉 Milestone!</h2>
      <p className="text-slate-700 text-xl mb-4">{milestone.name}</p>
      <img
        src={milestone.image}
        alt={milestone.name}
        className="w-full max-h-64 object-contain rounded-xl mb-5"
      />
      <button onClick={onClose} className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:opacity-90 transition">Continue Journey</button>
    </ModalContent>
  );
}

function LogbookModal({ habit, onClose }) {
    const journalEntries = habit.journal || [];
  return (
    <ModalContent className="max-w-lg">
      <div className="flex justify-between items-center mb-4 pt-2">
        <h2 className="text-2xl font-bold text-purple-700">My Logbook</h2>
        <button onClick={onClose} className="text-gray-400 text-3xl hover:text-gray-700 transition">&times;</button>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {journalEntries.length > 0 ? (
          [...journalEntries].sort((a, b) => b.day - a.day).map(({ day, entry }) => (
          <div key={day} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="font-bold text-purple-700">Day {parseInt(day) + 1}</p>
            <p className="text-slate-600 mt-1 whitespace-pre-wrap">{entry || "No entry recorded."}</p>
          </div>
        ))
        ) : (
        <p className="text-center text-gray-500 py-8">Your journal will appear here once you start logging your days.</p>
        )}
      </div>
    </ModalContent>
  );
}

function JourneyCompleteModal({ packName, onStartNew, onClose }) {
  useEffect(() => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
      ticks: 400,
      colors: ['#6d28d9', '#a855f7', '#fbcfe8', '#ffffff']
    });
  }, []);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2 pt-2">
          🎉 Journey Complete! 🎉
        </h2>
        <p className="text-slate-700 text-lg mb-4">
          Congratulations! You've successfully completed the <span className="font-bold text-purple-700">{packName}</span> quest.
        </p>
        <p className="text-slate-600 mb-6">
          You've built a powerful new habit. What challenge will you conquer next?
        </p>
        <div className="flex justify-center">
          <button
            onClick={onStartNew}
            className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-transform hover:scale-105 shadow-lg hover:shadow-purple-400/50"
          >
            Choose a New Quest
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

function CustomQuestModal({ onStart, onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('🎯');
    const avatars = ['🎯', '💡', '🌱', '💖', '🚀', '✨', '🧠', '✍️'];

    const handleSubmit = () => {
        if (name && description) {
            onStart({ name, description, avatar });
        }
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Create a Custom Quest</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Quest Name (e.g., Learn Guitar)" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"/>
                    <textarea placeholder="Description (e.g., Practice chords for 15 mins daily)" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded h-24 resize-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                    <div className="text-center">
                    <p className="font-semibold mb-2">Choose an Avatar</p>
                    <div className="flex justify-center space-x-2 flex-wrap">
                        {avatars.map(a => (
                            <button key={a} onClick={() => setAvatar(a)}
                              className={`text-3xl p-2 rounded-full ${avatar === a ? 'bg-purple-200' : 'bg-transparent hover:bg-purple-100'}`}>
                              {a}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="Or type your own emoji"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="mt-3 p-2 border rounded"
                    />
                  </div>
                </div>
                 <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="px-5 py-2 bg-purple-600 text-white rounded-lg">Start Quest</button>
                </div>
            </ModalContent>
        </ModalBackdrop>
    );
}