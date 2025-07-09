import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const AudioPlayer = ({ songs, setSongs, audioSource, setAudioSource, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/music/songs/")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        if (data.length > 0) {
          setAudioSource(data[0].url);
        }
      })
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Controls>
      <label htmlFor="track">🎵</label>
      <select
        id="track"
        value={audioSource}
        onChange={(e) => {
          setAudioSource(e.target.value);
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
        }}
      >
        {songs.map((song) => (
          <option key={song.id} value={song.url}>
            {song.name}
          </option>
        ))}
      </select>

      <button onClick={toggleAudio}>{isPlaying ? "⏸" : "▶"}</button>

      {/* 🎶 Visualizer */}
      {isPlaying && (
        <Visualizer>
          {[...Array(5)].map((_, i) => (
            <Bar key={i} delay={i * 0.1} />
          ))}
        </Visualizer>
      )}

      <audio ref={audioRef} loop src={audioSource} />
    </Controls>
  );
};

export default AudioPlayer;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: #ffffffee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-wrap: nowrap;

  label {
    font-size: 20px;
    margin-right: 4px;
    color: #333;
  }

  select {
    width: 120px; /* 👈 Make dropdown smaller */
    font-size: 0.9rem;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    color: #333;
  }

  button {
    padding: 6px 12px;
    background: ${(props) => props.theme.buttonColor};
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
      filter: brightness(0.9);
      transform: scale(1.05);
    }
  }

  @media (max-width: 500px) {
    flex-wrap: wrap;
    justify-content: center;
    select {
      width: 100px;
      font-size: 0.8rem;
    }
    button {
      font-size: 0.9rem;
      padding: 6px 10px;
    }
  }
`;

const bounce = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(2); }
  100% { transform: scaleY(1); }
`;

const Visualizer = styled.div`
  display: flex;
  gap: 3px;
  margin-left: auto;
  height: 18px;

  @media (max-width: 500px) {
    margin-left: 0;
  }
`;

const Bar = styled.div`
  width: 3px;
  height: 16px;
  background: ${(props) => props.theme.buttonColor};
  animation: ${bounce} 1s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  transform-origin: bottom;
  border-radius: 2px;
  box-shadow: 0 0 4px ${(props) => props.theme.buttonColor};
`;
