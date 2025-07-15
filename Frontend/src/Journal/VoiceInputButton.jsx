import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

const VoiceInputButton = ({ setText, themeColor }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const startChimeRef = useRef(null);
  const stopChimeRef = useRef(null);

  // 🎵 Load chimes once
  useEffect(() => {
    const loadChime = async (url, ref) => {
      const { Howl } = await import("howler");
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.url) {
          ref.current = new Howl({
            src: [data.url],
            volume: 0.5,
            format: ["mp3"]
          });
        }
      } catch (error) {
        console.warn("Failed to load chime:", url, error);
      }
    };

    loadChime("http://localhost:8000/music/api/chime/start_chime/", startChimeRef);
    loadChime("http://localhost:8000/music/api/chime/stop_chime/", stopChimeRef);
  }, []);

  // ⏱️ Timer for visual feedback
  useEffect(() => {
    if (isRecording) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsedTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const punctuateText = (raw) => {
    return raw
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length)
      .map((s) => {
        const lower = s.toLowerCase();
        const capped = s.charAt(0).toUpperCase() + s.slice(1);
        if (/[.!?]$/.test(capped)) return capped;
        else if (
          lower.startsWith("how") || lower.startsWith("what") ||
          lower.startsWith("is") || lower.startsWith("can") ||
          lower.startsWith("do") || lower.endsWith("right")
        ) return capped + "?";
        else if (
          lower.includes("wow") || lower.includes("amazing") ||
          lower.includes("so happy") || lower.includes("unbelievable")
        ) return capped + "!";
        else return capped + ".";
      }).join(" ");
  };

  const releaseMic = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach(track => track.stop()))
      .catch((err) => console.warn("Mic release error:", err));
  };

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      toast.error("🧨 Speech recognition is not supported in this browser.");
      return;
    }

    if (!isRecording) {
      recognition.onstart = () => {
        setIsRecording(true);
        startChimeRef.current?.play(); // 🔊 Play start chime
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += punctuateText(event.results[i][0].transcript);
          }
        }

        if (finalTranscript) {
          setText(prev => (prev.trim() + " " + finalTranscript).trim());
          toast.success("📝 Voice input added");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        stopChimeRef.current?.play(); // 🔊 Play stop chime
        releaseMic();
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setIsRecording(false);
        stopChimeRef.current?.play();
        releaseMic();
      };

      recognition.start();
    } else {
      recognition.stop(); // 👈 Manual stop
      setIsRecording(false);
      stopChimeRef.current?.play();
      releaseMic();
    }
  };

  // 🎤 Prepare speech recognition instance once
  useEffect(() => {
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
    }
  }, []);

  return (
    <button
      onClick={handleVoiceInput}
      style={{
        width: "150px",
        padding: "10px 16px",
        borderRadius: "12px",
        border: "none",
        backgroundColor: isRecording ? "#e53935" : themeColor,
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
        transition: "background 0.3s ease"
      }}
    >
      {isRecording ? `⏹ Stop (${elapsedTime}s)` : "🎙 Start Voice"}
    </button>
  );
};

export default VoiceInputButton;
