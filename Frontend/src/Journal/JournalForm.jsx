import React, { useState, useRef, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const themes = {
  pastelBlue: {
    name: "Pastel Blue 💙",
    notebookBackground: "linear-gradient(135deg, #d0eefd, #f0f8ff)",
    buttonColor: "#87CEFA",
  },
  pastelPink: {
    name: "Pastel Pink 💗",
    notebookBackground: "linear-gradient(135deg, #fddde6, #ffe0f0)",
    buttonColor: "#FFB6C1",
  },
  pastelGreen: {
    name: "Pastel Green 💚",
    notebookBackground: "linear-gradient(135deg, #d4fddf, #e0ffe5)",
    buttonColor: "#98FB98",
  },
};

const emojis = ["😊", "😢", "😡", "😂", "😴", "🤯", "😍", "🤓", "🥳"];

const formatDate = (date) => date.toISOString().split("T")[0];

export default function J1() {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState("pastelBlue");
  const [fontFamily, setFontFamily] = useState("'Comic Sans MS', cursive");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [showEmojis, setShowEmojis] = useState(false);
  const [journalData, setJournalData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [songs, setSongs] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // ✅ false by default
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = "/journal";

  // ✅ Load songs from Django
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

  const handleNavigate = (to) => {
    navigate(to, { state: { from: location } });
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/journal/analyze/",
        { text }
      );
      const { top_emotions, highlight } = response.data;
      setAnalysisResult({ top_emotions, highlight });

      const token = sessionStorage.getItem("token");

      if (!token) {
        sessionStorage.setItem("pending_journal", text);
        sessionStorage.setItem(
          "pending_analysis",
          JSON.stringify({ top_emotions, highlight })
        );
        return;
      }

      await axios.post("http://127.0.0.1:8000/journal/save/", {
        userid: sessionStorage.getItem("userid"),
        text,
        analysis: { top_emotions, highlight },
      });
    } catch (error) {
      console.error("❌ Error submitting journal:", error);
    }
  };

  const loadJournal = (date) => {
    const dateKey = formatDate(date);
    const entry = journalData[dateKey];
    if (entry) {
      setText(entry.text);
      setSelectedEmoji(entry.emoji);
      setTheme(entry.theme);
      setFontFamily(entry.font);
    } else {
      setText("");
      setSelectedEmoji("😊");
      setTheme("pastelBlue");
      setFontFamily("'Comic Sans MS', cursive");
    }
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsAudioPlaying(true);
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      <Navbar />
      <Wrapper className="bg-gradient-to-r from-[#838beb]/10 to-[#838bbb]/20 bg-blur-2xl">
        <Header>
          <LeftSection className="flex gap-20">
            <div className="flex align-middle gap-10 mt-6">
              <DateBox>{new Date().toDateString()}</DateBox>
              {/* <CalendarButton onClick={() => setCalendarOpen(true)}>
                📅
              </CalendarButton> */}
            </div>

            <AudioControls>
              <label htmlFor="soundSelect">🎵</label>
              <select
                id="soundSelect"
                value={audioSource}
                style={{ background: themes[theme].notebookBackground }}
                onChange={(e) => {
                  setAudioSource(e.target.value);
                  setIsAudioPlaying(false); // Stop playing when changing song
                  if (audioRef.current) audioRef.current.pause();
                }}
              >
                {songs.map((song) => (
                  <option
                    key={song.id}
                    value={song.url}
                    style={{ background: themes[theme].notebookBackground }}
                    className="w-24"
                  >
                    {song.name}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleAudio}
                style={{ background: themes[theme].notebookBackground }}
              >
                {isAudioPlaying ? "⏸" : "▶"}
              </button>
            </AudioControls>
          </LeftSection>

          <RightSection className="mt-6">
            <ThemeSelector
              style={{ background: themes[theme].notebookBackground }}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {Object.entries(themes).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </ThemeSelector>

            <FontSelector
              style={{ background: themes[theme].notebookBackground }}
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              {[
                { name: "Comic Sans", value: "'Comic Sans MS', cursive" },
                { name: "Serif", value: "serif" },
                { name: "Monospace", value: "'Courier New', monospace" },
                { name: "Quicksand", value: "'Quicksand', sans-serif" },
                { name: "Caveat", value: "'Caveat', cursive" },
              ].map((font, idx) => (
                <option key={idx} value={font.value}>
                  {font.name}
                </option>
              ))}
            </FontSelector>

            <EmojiContainer>
              <EmojiButton
                className="p-6"
                style={{ background: themes[theme].notebookBackground }}
                onClick={() => setShowEmojis(!showEmojis)}
              >
                {selectedEmoji}
              </EmojiButton>
              {showEmojis && (
                <EmojiPanel>
                  {emojis.map((e, i) => (
                    <EmojiOption
                      key={i}
                      selected={selectedEmoji === e}
                      onClick={() => {
                        setSelectedEmoji(e);
                        setShowEmojis(false);
                      }}
                    >
                      {e}
                    </EmojiOption>
                  ))}
                </EmojiPanel>
              )}
            </EmojiContainer>
          </RightSection>
        </Header>

        <NotebookContainer>
          <Notebook
            style={{
              background: themes[theme].notebookBackground,
              fontFamily,
            }}
          >
            <textarea
              placeholder="Dear Diary,..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="margin" />
          </Notebook>
        </NotebookContainer>

        <SubmitButton onClick={handleSubmit}>📤 Submit Journal</SubmitButton>

        {analysisResult && (
          <HighlightCard>
            <h4>📝 Today's Emotional Summary</h4>

            {analysisResult.top_emotions.map(([emotion, score], i) => (
              <EmotionBar key={i}>
                <Label>{emotion}</Label>
                <BarWrapper>
                  <Bar style={{ width: `${(score * 100).toFixed(0)}%` }} />
                  <Score>{(score * 100).toFixed(0)}%</Score>
                </BarWrapper>
              </EmotionBar>
            ))}

            <p>
              🧠 Key Insight: <em>"{analysisResult.highlight}"</em>
            </p>

            {!sessionStorage.getItem("token") && (
              <p style={{ marginTop: "10px", color: "#555" }}>
                🔒 To save this journal and unlock productivity insights,{" "}
                <span
                  style={{
                    color: "#007BFF",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigate("/signup")}
                >
                  Sign up
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "#007BFF",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigate("/login")}
                >
                  Log in
                </span>
                .
              </p>
            )}
          </HighlightCard>
        )}

        <Modal
          isOpen={calendarOpen}
          onRequestClose={() => setCalendarOpen(false)}
        >
          <h2>Select a day to view/edit</h2>
          <Calendar
            onClickDay={loadJournal}
            tileContent={({ date, view }) => {
              const key = formatDate(date);
              const entry = journalData[key];
              return view === "month" && entry ? (
                <div style={{ fontSize: "1.2rem", textAlign: "center" }}>
                  {entry.emoji}
                </div>
              ) : null;
            }}
          />
          <button onClick={() => setCalendarOpen(false)}>Close</button>
        </Modal>

        <audio ref={audioRef} loop src={audioSource} />
      </Wrapper>
    </ThemeProvider>
  );
}

// === Styles ===

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Comic Sans MS', cursive;
    background: #f9f9f9;
    transition: background 0.5s ease-in-out;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ThemeSelector = styled.select`
  font-size: 1rem;
  padding: 5px 10px;
  border-radius: 8px;
  color: black;
  background: white;
`;

const FontSelector = styled.select`
  font-size: 1rem;
  padding: 5px 10px;
  border-radius: 8px;
  color: black;
  background: white;
`;

const DateBox = styled.div`
  font-size: 1.2rem;
  color: black;
`;

const CalendarButton = styled.button`
  margin-left: 10px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const EmojiContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const EmojiButton = styled.button`
  background: white;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
`;

const EmojiPanel = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

const EmojiOption = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  background: ${(props) => (props.selected ? "#ddd" : "transparent")};
  border-radius: 5px;
  padding: 2px 4px;
`;

const NotebookContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Notebook = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 800px;
  height: 500px;
  overflow-y: auto;
  font-size: 20px;
  border-radius: 10px;
  background-image: linear-gradient(#f5f5f0 1.6rem, #ccc 1.7rem);
  background-size: 100% 1.7rem;
  line-height: 1.7rem;
  padding: 1.4rem 0.5rem 0.3rem 4.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    background: transparent;
    outline: none;
    font-size: inherit;
    line-height: inherit;
    color: black;
    padding: 0;
    text-indent: 1rem;
    box-sizing: border-box;
  }

  .margin {
    position: absolute;
    border-left: 1px solid #d88;
    height: 100%;
    left: 3.3rem;
    top: 0;
  }
`;

const AudioControls = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    color: black;
  }

  select {
    font-size: 1rem;
    padding: 5px 8px;
    border-radius: 6px;
    color: black;
    background: white;
  }

  button {
    padding: 5px 10px;
    border: none;
    background: #eee;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    color: black;
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  background-color: ${(props) => props.theme.buttonColor};
  color: black;
  font-size: 1.1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

const HighlightCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f0f0f0, #e6f7ff);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  width: 100%;
  max-width: 600px;

  h4 {
    margin-bottom: 10px;
    color: #2a7bc3;
  }

  p {
    font-size: 0.95rem;
    color: #444;
  }
`;

const EmotionBar = styled.div`
  margin: 8px 0;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  height: 20px;
`;

const Bar = styled.div`
  background: #76c7c0;
  height: 100%;
  transition: width 0.5s ease;
`;

const Score = styled.span`
  margin-left: 8px;
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
`;
