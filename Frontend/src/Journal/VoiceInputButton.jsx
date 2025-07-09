import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const VoiceInputButton = ({ setText,themeColor  }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const recordingStartRef = useRef(null);

  useEffect(() => {
    if (SpeechRecognition && !recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        if (recordingStartRef.current) {
          const seconds = Math.floor((Date.now() - recordingStartRef.current) / 1000);
          setElapsedTime(seconds);
        }
      }, 1000);
    } else {
      clearInterval(interval);
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const punctuateText = (raw) => {
    return raw
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length)
      .map((s) => {
        const capped = s[0].toUpperCase() + s.slice(1);
        return /[.!?]$/.test(capped) ? capped : capped + ".";
      })
      .join(" ");
  };

  const releaseMic = () => {
    // Stop any active audio stream from the mic
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => console.warn("Mic release error:", err));
  };

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!isRecording) {
      recognition.onstart = () => {
        setIsRecording(true);
        recordingStartRef.current = Date.now();
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += punctuateText(transcript);
          }
        }
        setText((prev) => prev + " " + finalTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recordingStartRef.current = null;
        releaseMic(); // 🔥 Ensures mic is fully stopped
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setIsRecording(false);
        releaseMic();
      };

      recognition.start();
    } else {
      recognition.stop();
      setIsRecording(false);
      releaseMic(); // ✅ Explicit mic stop
    }
  };

  return (
    <button
        onClick={handleVoiceInput}
        style={{
            width: "150px",           
            textAlign: "center",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "none",
            background: isRecording ? "#f44336" : themeColor,
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
        >
        {isRecording ? `⏹ Stop Recording (${elapsedTime}s)` : "🎙 Start Voice"}
        </button>
  );
};

export default VoiceInputButton;
