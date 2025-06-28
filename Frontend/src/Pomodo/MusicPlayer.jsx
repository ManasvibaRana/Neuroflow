import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const MusicPlayer = () => {
  const tracks = [
    { name: "Sample 1", artist: "Test Artist", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Sample 2", artist: "Test Artist", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Sample 3", artist: "Test Artist", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ];

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (track) => {
    if (!audioRef.current) return;

    if (currentTrack?.name === track.name && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrack?.name !== track.name) {
        setCurrentTrack(track);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Autoplay blocked:', err);
        });
      }
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Autoplay blocked:', err);
      });
    }
  }, [currentTrack]);

  return (
    <StyledWrapper>
      <div className="music-card">
        <h2 className="title">🎵 Focus & Calm Playlist</h2>
        <div className="scroll-list">
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className={`track-item ${currentTrack?.name === track.name && isPlaying ? 'active' : ''}`}
              onClick={() => handlePlay(track)}
            >
              <div className="track-info">
                <p className="track-name">{track.name}</p>
                <p className="track-artist">{track.artist}</p>
              </div>
              {currentTrack?.name === track.name && isPlaying ? (
                <div className="bars">
                  <div className="bar" />
                  <div className="bar" />
                  <div className="bar" />
                  <div className="bar" />
                </div>
              ) : (
                <div className="play-icon" />
              )}
            </div>
          ))}
        </div>

        <audio ref={audioRef} controls style={{ width: '100%', marginTop: '1rem' }} />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .music-card {
    background: #fdf6f0;
    border-radius: 20px;
    padding: 2rem;
    max-width: 400px;
    margin: 1rem auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }

  .title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
  }

  .scroll-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .track-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    margin: 0.5rem 0;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .track-item:hover {
    background: #f0eaf5;
  }

  .track-item.active {
    background: #d6e0f5;
  }

  .track-info {
    flex: 1;
  }

  .track-name {
    font-weight: bold;
    color: #333;
  }

  .track-artist {
    font-size: 0.8rem;
    color: #666;
  }

  .bars {
    display: flex;
  }

  .bar {
    width: 3px;
    height: 20px;
    background: #4caf50;
    margin: 0 1px;
    animation: bounce 1s infinite;
  }

  .bar:nth-child(1) { animation-delay: 0.1s; }
  .bar:nth-child(2) { animation-delay: 0.3s; }
  .bar:nth-child(3) { animation-delay: 0.5s; }
  .bar:nth-child(4) { animation-delay: 0.7s; }

  .play-icon {
    width: 0;
    height: 0;
    border-left: 10px solid #555;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }

  @keyframes bounce {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }
`;

export default MusicPlayer;
