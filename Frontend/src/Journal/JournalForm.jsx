import React, { useState, useRef, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import axios from "axios";
import Navbar from "../Navbar";
import VoiceInputButton from "./VoiceInputButton";
import JournalAnalysis from "./JournalAnalysis";
import AudioPlayer from "./AudioPlayer";
import { useNavigate } from "react-router-dom";
import ChatButton from '../Chat/ChatButton';
import { toast } from "sonner";
import useSound from "use-sound";

const emotionEmojis = [
  { emotion: "Joy", emoji: "😊" },
  { emotion: "Sadness", emoji: "😢" },
  { emotion: "Anger", emoji: "😡" },
  { emotion: "Fear", emoji: "😨" },
  { emotion: "Disgust", emoji: "🤢" },
  { emotion: "Surprise", emoji: "😲" },
  { emotion: "Neutral", emoji: "😐" },
];

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
  pastelPurple: {
  name: "Pastel Purple 💜",
  notebookBackground: "linear-gradient(135deg, #e6e6fa, #f3e5f5)",
  buttonColor: "#DDA0DD",
},
pastelYellow: {
  name: "Pastel Yellow 💛",
  notebookBackground: "linear-gradient(135deg, #fff9c4, #fffde7)",
  buttonColor: "#FFD700",
},
pastelOrange: {
  name: "Pastel Orange 🧡",
  notebookBackground: "linear-gradient(135deg, #ffebcd, #ffe0b2)",
  buttonColor: "#FFB74D",
},

};

const emojis = ["😊", "😢", "😡", "😂", "😴", "🤯", "😍", "🤓", "🥳"];

export default function JournalForm() {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState("pastelBlue");
  const [fontFamily, setFontFamily] = useState("'Caveat', cursive");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");

  const [images, setImages] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [savedJournalId, setSavedJournalId] = useState(null);
  const [journalId, setJournalId] = useState(null); 

  const [songs, setSongs] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showJournalReminder, setShowJournalReminder] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedIndex, setEnlargedIndex] = useState(null);
  const enlargedImage = enlargedIndex !== null ? images[enlargedIndex] : null;

  const [chimeUrl, setChimeUrl] = useState(null);
  const chimeRef = useRef(null);

    useEffect(() => {
      fetch('http://localhost:8000/music/api/chime/entry_saved_chime/')
        .then(res => res.json())
        .then(data => {
          if (data.url) setChimeUrl(data.url);
        });
    }, []);

  const [playChime, { sound }] = useSound(chimeUrl || "", {
    volume: 0.5,
    soundEnabled: false,
     format: ['mp3'],
  });

  const fileRef = useRef();
  const audioRef = useRef();
  const analysisRef = useRef(null);
  const resultRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
     const handleKeyDown = (e) => {
        if (enlargedIndex === null) return;

        if (e.key === "Escape") {
          setEnlargedIndex(null);
        } else if (e.key === "ArrowRight") {
          setEnlargedIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === "ArrowLeft") {
          setEnlargedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enlargedIndex, images.length]);

  useEffect(() => {
  const savedTheme = localStorage.getItem("journalTheme");
  const savedFont = localStorage.getItem("journalFont");

  if (savedTheme && themes[savedTheme]) {
        setTheme(savedTheme);
      }

      if (savedFont) {
        setFontFamily(savedFont);
      }
    }, []);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userid = sessionStorage.getItem("userid");

    if (token && userid) {
      axios.get(`http://localhost:8000/journal/today/${userid}/`)
        .then((res) => {
          const data = res.data;
          setText(data.text || "");
          setAnalysisResult({
            top_emotions: data.top_emotions,
            highlight: data.highlight,
          });
          setJournalId(data.journal_id);

          // 🟢 Load image list
          if (Array.isArray(data.images)) {
            const loadedImages = data.images.map(img => ({
              id: img.id,
              url: img.image.startsWith("http")
                ? img.image
                : `http://localhost:8000${img.image}`,
                 caption: img.caption || "",
            }));
            setImages(loadedImages);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status !== 404) {
            console.error("Error fetching today's journal:", err);
          }
        });
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/music/songs/")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        if (data.length > 0) setAudioSource(data[0].url);
      })
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (unsavedChanges) {
      e.preventDefault();
      e.returnValue = ""; // Standard message for browser confirmation
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [unsavedChanges]);

  const MAX_IMAGES = 5;

  const handleImage = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - images.length;
    if (!journalId || remainingSlots <= 0) return;

    const filesToUpload = files.slice(0, remainingSlots);

    const previews = filesToUpload.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,   // 🟡 temporary flag
    }));

    // 👇 show previews immediately
    setImages(prev => [...prev, ...previews]);

    const formData = new FormData();
    formData.append("journal", journalId);
    filesToUpload.forEach((file) => {
      formData.append("images", file);
      formData.append("captions", ""); // 👈 Upload empty captions for now
    });


    try {
      const res = await fetch("http://localhost:8000/journalmedia/upload-images/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const uploaded = data.images.map((img, i) => ({
        id: img.id,
        url: img.image.startsWith("http")
        ? img.image
        : `http://localhost:8000${img.image}`,
        preview: previews[i].preview, // 👈 re-use preview so no flashing
        uploading: false,
      }));

      // ✅ Update only the recently added ones
      setImages(prev => {
        const stillSaved = prev.filter(img => !img.uploading); // remove temp
        return [...stillSaved, ...uploaded]; // keep preview until upload complete
      });
    } catch (err) {
      console.error("Failed to upload images:", err);
    }
  };

  const removeImage = async (idx) => {
    const imgObj = images[idx];

    // If it's a saved image (has `id`), delete from backend
    if (imgObj.id) {
      try {
        await axios.delete(`http://localhost:8000/journalmedia/delete-image/${imgObj.id}/`);
      } catch (err) {
        console.error("Failed to delete image:", err);
        return;
      }
    }

    // Remove from state
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
  // 🟡 Load and prepare chime only after user gesture
  if (chimeUrl && !chimeRef.current) {
    const { Howl } = await import('howler'); // lazy import
    chimeRef.current = new Howl({
      src: [chimeUrl],
      volume: 0.5,
      format: ['mp3'],
    });
  }

  // ❗ Validate input
  if (!text.trim()) {
    if (images.length > 0) {
      toast.error("🛑 Please write something before submitting your journal.");
    }
    return;
  }

  try {
    // 🧠 Analyze journal text
    const response = await axios.post("http://127.0.0.1:8000/journal/analyze/", { text });
    const { top_emotions, highlight } = response.data;
    setAnalysisResult({ top_emotions, highlight });

    toast.success("✅ Journal analyzed successfully!");

    // 🧠 Compare with selected emoji
    const predicted = emotionEmojis.find(e => e.emoji === selectedEmoji)?.emotion || "Unknown";
    const topEmotionRaw = Array.isArray(top_emotions) && top_emotions.length > 0 ? top_emotions[0][0] : null;
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const topEmotion = typeof topEmotionRaw === "string" && topEmotionRaw.trim() !== ""
      ? capitalize(topEmotionRaw)
      : "Unknown";

    const isMatch =
      typeof predicted === "string" &&
      typeof topEmotion === "string" &&
      topEmotion !== "Unknown" &&
      predicted.toLowerCase() === topEmotion.toLowerCase();

    setSubmissionResult({
      emoji: selectedEmoji,
      predicted: predicted,
      actual: topEmotion,
      isCorrect: isMatch,
    });

    // 📜 Scroll to result and chime
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
      chimeRef.current?.play(); // 🔔 Play after analysis
    }, 300);

    // 🔐 Guest fallback
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("pending_journal", text);
      sessionStorage.setItem("pending_analysis", JSON.stringify({ top_emotions, highlight }));
      toast.info("⚠️ You're not logged in. Journal saved locally.");
      return;
    }

    // ✅ Save journal entry
    const saveRes = await axios.post("http://127.0.0.1:8000/journal/save/", {
      userid: sessionStorage.getItem("userid"),
      text,
      analysis: { top_emotions, highlight },
    });

    const newJournalId = saveRes.data.journal_id;
    setJournalId(newJournalId);
    toast.success("📒 Journal saved successfully!");

    // 📤 Upload images (after journal save)
    if (images.some(img => img.file)) {
      const formData = new FormData();
      formData.append("journal", newJournalId);
      images.forEach(({ file }) => file && formData.append("images", file));

      try {
        const uploadRes = await fetch("http://localhost:8000/journalmedia/upload-images/", {
          method: "POST",
          body: formData,
        });

        const data = await uploadRes.json();
        const uploaded = data.images.map(img => ({
          id: img.id,
          url: img.image.startsWith("http")
            ? img.image
            : `http://localhost:8000${img.image}`,
        }));

        setImages(uploaded);
        toast.success("🖼️ Images uploaded successfully!");
      } catch (imgErr) {
        toast.error("⚠️ Failed to upload images.");
        console.error("Image upload failed:", imgErr);
      }
    }

    // Final chime to celebrate success!
    chimeRef.current?.play();

    setUnsavedChanges(false); // ✅ Clear dirty flag
  } catch (err) {
    console.error("Submit failed:", err);
    toast.error("❌ Submission failed. Please try again.");
  }
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle font={fontFamily} />
      <Navbar />

      <Main>
          {!isMobile && images.length > 0 && (
            <FixedGalleryWrapper $bg={themes[theme].notebookBackground}>
              <GalleryHeader>📔 Visual Diary</GalleryHeader>
              <ScrollableGallery>
                {images.map((img, i) => (
                  <Polaroid key={i}>
                    <img src={img.url || img.preview} alt={`img-${i}`} onClick={() => setEnlargedIndex(i)}
  style={{ cursor: "zoom-in" }} />
                    <button onClick={() => removeImage(i)}>✕</button>
                    <textarea
                      placeholder="Write a caption..."
                      value={img.caption || ""}
                      onChange={async (e) => {
                        const newCaption = e.target.value;
                        const updatedImages = [...images];
                        updatedImages[i].caption = newCaption;
                        setImages(updatedImages);

                        if (img.id) {
                          try {
                            await axios.patch(
                              `http://localhost:8000/journalmedia/update-caption/${img.id}/`,
                              { caption: newCaption }
                            );
                          } catch (err) {
                            console.error("Failed to update caption:", err);
                          }
                        }
                      }}
                    />
                  </Polaroid>
                ))}
              </ScrollableGallery>
            </FixedGalleryWrapper>
          )}

          <ColumnWrapper>
          <JournalCard>
            <Header>
              <ThemeFont>
                <select value={theme} onChange={(e) => {
                  const selectedTheme = e.target.value;
                  setTheme(selectedTheme);
                  localStorage.setItem("journalTheme", selectedTheme); 
                }}>
                  {Object.entries(themes).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
                <select
                    value={fontFamily}
                    onChange={(e) => {
                      const selectedFont = e.target.value;
                      setFontFamily(selectedFont);
                      localStorage.setItem("journalFont", selectedFont); 
                    }}
                  >
                  {[
                  { name: "Caveat", value: "'Caveat', cursive" },
                  { name: "Inter", value: "'Inter', sans-serif" },
                  { name: "Roboto", value: "'Roboto', sans-serif" },
                  { name: "Merriweather", value: "'Merriweather', serif" },
                  { name: "Poppins", value: "'Poppins', sans-serif" },
                  { name: "Monospace", value: "monospace" }
                ].map(({ name, value }) => (
                    <option key={value} value={value} style={{ fontFamily: value }}>
                      {name}
                    </option>
                  ))}
                </select>
              </ThemeFont>

            <VoiceInputButton
                setText={setText}
                setIsAudioPlaying={setIsAudioPlaying}
                audioRef={audioRef}
                themeColor={themes[theme].buttonColor}
              />

              <EmojiPicker>
                {sessionStorage.getItem("token") ? (
                  <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button
                      onClick={() => {
                        if (!journalId) {
                          setShowJournalReminder(true);
                          setTimeout(() => setShowJournalReminder(false), 3000); // auto hide
                        } else {
                          fileRef.current.click();
                        }
                      }}
                      disabled={images.length >= MAX_IMAGES}
                      style={{
                        background: images.length >= MAX_IMAGES ? "#ccc" : themes[theme].buttonColor,
                        color: images.length >= MAX_IMAGES ? "#888" : "#fff",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: images.length >= MAX_IMAGES ? "not-allowed" : "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        position: "relative",
                      }}
                    >
                      📸 Add Photo
                    </button>

                    {/* ✅ Floating Reminder */}
                    {showJournalReminder && (
                      <div
                        style={{
                          position: "absolute",
                          top: "110%",
                          background: "#ffefef",
                          color: "#d00",
                          fontSize: "12px",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          whiteSpace: "nowrap",
                          zIndex: 5,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        📝 Please submit journal first
                      </div>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImage}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: "13px", color: "#888" }}>
                    🔒 Log in to add photos
                  </span>
                )}
              </EmojiPicker>

            </Header>
        
            <div style={{
              fontSize: "16px",
              color: "#555",
              textAlign: "center",
              fontWeight: 500,
              marginTop: "-10px",
              paddingBottom: "2px",
            }}>
              📖 Entry for{" "}
              <span style={{ color: "#333", fontWeight: "bold" }}>
                {selectedDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>

            <Notebook fontFamily={fontFamily} style={{ background: themes[theme].notebookBackground }}>
              <Ruling /> 
            <EmojiGuess>
              <span style={{ fontWeight: 500 }}>How do you feel today?</span>
              {emotionEmojis.map(({ emoji, emotion }) => (
                <EmojiButton
                key={emotion}
                onClick={() => setSelectedEmoji(emoji)}
                className={selectedEmoji === emoji ? "selected" : ""}
              >
                <Tooltip>{emotion}</Tooltip>
                <span>{emoji}</span>
              </EmojiButton>
              ))}
            </EmojiGuess>
              <hr style={{
                border: "none",
                borderTop: "2px dashed rgba(0,0,0,0.2)",
                margin: "10px 0px",
              }} />
              <NotebookTextarea
                  placeholder="Write your memory..."
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setUnsavedChanges(true); 
                  }}
                />
            </Notebook>

            <Footer>
              <AudioWrapper>
                <AudioPlayer
                  songs={songs}
                  setSongs={setSongs}
                  audioSource={audioSource}
                  setAudioSource={setAudioSource}
                  isPlaying={isAudioPlaying}
                  setIsPlaying={setIsAudioPlaying}
                />
              </AudioWrapper>

              <SubmitBtn onClick={handleSubmit}>📤 Save</SubmitBtn>
            </Footer>

          </JournalCard>
            {analysisResult && (
                <ThemedCard style={{ marginTop: "24px" }} $themeColor={themes[theme].buttonColor}>
                  <h3 style={{ marginTop: 0, fontSize: "18px", color: "#444" }}>🧠 Emotion Analysis</h3>
                  <AnalysisWrapper ref={analysisRef}>
                    <JournalAnalysis
                      ref={analysisRef}
                      analysisResult={analysisResult}
                      onSignUpClick={() => navigate("/signup")}
                      onLoginClick={() => navigate("/login")}
                      $background={themes[theme].notebookBackground}
                    />
                  </AnalysisWrapper>
                </ThemedCard>
              )}

              {submissionResult && (
                <ThemedCard style={{ marginTop: "24px" }} $themeColor={themes[theme].buttonColor}>
                  <h3 style={{ marginTop: 0, fontSize: "18px", color: "#444" }}>🎯 Emotion Match Result</h3>
                  <div ref={resultRef} style={{ textAlign: "center", padding: "10px" }}>
                    <div style={{ fontSize: "42px", marginBottom: "8px" }}>{submissionResult.emoji}</div>
                    <p style={{ fontSize: "16px", color: "#444" }}>
                      <strong>You predicted:</strong> {submissionResult.predicted}
                      <br />
                      <strong>AI detected:</strong> {submissionResult.actual}
                    </p>
                    <p style={{
                      color: submissionResult.isCorrect ? "green" : "crimson",
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginTop: "8px"
                    }}>
                      {submissionResult.isCorrect
                        ? "✅ Spot on! You understood your emotion well."
                        : "❌ Hmm... seems like your feelings were deeper than you thought."}
                    </p>
                  </div>
                </ThemedCard>
              )}
          </ColumnWrapper>
          {isMobile && images.length > 0 && (
                    <MobileGallery $background={themes[theme].notebookBackground}>
                      {images.map((img, i) => (
                        <Polaroid key={i}>
                          <img src={img.url || img.preview} alt={`img-${i}`} onClick={() => setEnlargedIndex(i)}
  style={{ cursor: "zoom-in" }}/>
                          <button onClick={() => removeImage(i)}>✕</button>
                          <textarea
                            placeholder="Write a caption..."
                            value={img.caption || ""}
                            onChange={async (e) => {
                              const newCaption = e.target.value;
                              const updatedImages = [...images];
                              updatedImages[i].caption = newCaption;
                              setImages(updatedImages);

                              if (img.id) {
                                try {
                                  await axios.patch(
                                    `http://localhost:8000/journalmedia/update-caption/${img.id}/`,
                                    { caption: newCaption }
                                  );
                                } catch (err) {
                                  console.error("Failed to update caption:", err);
                                }
                              }
                            }}
                          />
                        </Polaroid>
                      ))}
                    </MobileGallery>
                  )}
          {enlargedImage && (
            <PolaroidModal onClick={() => setEnlargedIndex(null)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <img src={enlargedImage.url || enlargedImage.preview} alt="enlarged" />
                <p>{enlargedImage.caption}</p>
                <CloseModal onClick={() => setEnlargedIndex(null)}>✕</CloseModal>

                {enlargedIndex > 0 && (
                  <ArrowLeft onClick={() => setEnlargedIndex(enlargedIndex - 1)}>←</ArrowLeft>
                )}
                {enlargedIndex < images.length - 1 && (
                  <ArrowRight onClick={() => setEnlargedIndex(enlargedIndex + 1)}>→</ArrowRight>
                )}
              </ModalCard>
            </PolaroidModal>
          )}
          <ChatButton/>
      </Main>
    
    </ThemeProvider>
  );
}

  const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      background: #f0f4f8;
      font-family: 'Inter', sans-serif; /* <-- fixed universal font */
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  
  const Main = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 32px;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    height: 100%; /* new */
    flex: 1;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      padding-bottom: 100px;
      gap: 20px;
    }
  `;

  const JournalCard = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    gap: 20px;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    height: 100%; /* added */

    @media (max-width: 768px) {
      padding: 16px;
    }
  `;

  const ThemedCard = styled.div`
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: 20px 24px;
    border-radius: 16px;
    background: ${({ $themeColor }) => `${$themeColor}15`}; /* light translucent tint */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid ${({ $themeColor }) => `${$themeColor}55`}; /* soft colored border */
    transition: transform 0.3s ease;
    animation: fadeIn 0.4s ease;

    &:hover {
      transform: translateY(-2px);
    }

    h3 {
      font-size: 20px;
      color: #333;
      margin-bottom: 12px;
    }

    @media (max-width: 768px) {
      padding: 16px;
    }
  `;

  const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
  `;

  const EmojiPicker = styled.div`
    display: flex;
    align-items: center;
  `;

  const ThemeFont = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;

    select {
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      background: #fff;
      font-size: 14px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      transition: all 0.2s;

      &:hover {
        border-color: #999;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      select {
        width: 100%;
      }
    }
  `;

  const Notebook = styled.div`
    width: 100%;
    height: 400px;
    position: relative;
    background-image: linear-gradient(#f5f5f0 1.6rem, #ccc 1.7rem);
    background-size: 100% 1.7rem;
    border-radius: 12px;
    font-family: ${(props) => props.fontFamily || "'Caveat', cursive"};
    display: flex;
    flex-direction: column;
  `;

  const Ruling = styled.div`
    position: absolute;
    top: 0;
    left: 60px;
    bottom: 0;
    width: 0;
    border-left: 2px dashed rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 1;
  `;

  const NotebookTextarea = styled.textarea`
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    padding: 1.4rem 1rem 1.4rem 70px;
    background: transparent;
    outline: none;
    font-size: 18px;
    line-height: 1.6rem;
    box-sizing: border-box;
    overflow-y: auto;
    scrollbar-width: thin;
    z-index: 2;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #aaa;
      border-radius: 8px;
    }

    @media (max-width: 600px) {
      padding-left: 50px;
    }
  `;

  const EmojiGuess = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-left: 70px; /* ✅ perfectly aligns right of ruler */
    overflow: visible;
    position: relative; /* allow tooltips to position correctly */

    span {
      font-size: 1rem;
      color: #444;
    }

    @media (max-width: 768px) {
      padding-left: 50px;
    }
  `;

  const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: nowrap; // ✅ Prevents the Save button from dropping
    margin-top: 10px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  `;

  const AudioWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 10px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

  const SubmitBtn = styled.button`
    background: ${(props) => props.theme.buttonColor};
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      filter: brightness(0.9);
    }
  `;

  const AnalysisWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
  `;

  const Tooltip = styled.div`
    position: absolute;
    bottom: 80%;
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.25);
    color: #111;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 10;
  `;

  const EmojiButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.4;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &.selected {
    transform: scale(1.4);
    opacity: 1;
  }

  &:hover {
    transform: scale(1.2);
    opacity: 0.8;
  }

  &:hover > ${Tooltip} {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

  const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 1;
  `;

  const GalleryHeader = styled.h4`
    text-align: center;
    font-size: 18px;
    color: #444;
    margin-bottom: 12px;
  `;

  const FixedGalleryWrapper = styled.div`
    width: 240px;
    height: 100%; /* match JournalCard height */
    max-height: 100%;
    overflow-y: auto;
    padding: 16px 12px;
    background: ${({ $bg }) => $bg || "#ffffffcc"};
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (max-width: 768px) {
      display: none;
    }
  `;

  const Polaroid = styled.div`
    background: #fff;
    border-radius: 12px;
    border: 1px solid grey;  
    box-shadow: 2px 6px 12px rgba(0, 0, 0, 0.08);
    padding: 6px;
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      border: 1px solid black;
      max-height: 160px;
      object-fit: contain;
      border-radius: 8px;
    }

    button {
      position: absolute;
      top: 6px;
      right: 8px;
      background: crimson;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      z-index: 2;
    }

    textarea {
      width: 100%;
      border: none;
      background: transparent;
      resize: none;
      font-size: 13px;
      color: #333;
      padding-top: 4px;
      text-align: center;
      font-family: 'Caveat', cursive;
      outline: none;
      min-height: 20px;
      line-height: 1.2;
      margin: 0;
    }
  `;

  const ScrollableGallery = styled.div`
    flex: 1; /* grow and take up all remaining space */
    overflow-y: auto;
    scroll-behavior: smooth;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const MobileGallery = styled.div`
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 12px 16px;
    background: #fff;
    margin-top: 24px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: ${({ $background }) => $background || "#fff"};

    ${Polaroid} {
      min-width: auto;
      flex-shrink: 0;
    }

    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
  `;

  const PolaroidModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  `;

  const ModalCard = styled.div`
    background: #fff;
    padding: 16px;
    border-radius: 16px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s ease;

    img {
      max-width: 100%;
      max-height: 60vh;
      display: block;
      margin: 0 auto;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    p {
      text-align: center;
      margin-top: 12px;
      font-family: 'Caveat', cursive;
      font-size: 16px;
      color: #444;
    }
    @media (max-width: 768px) {
    padding: 12px;

    p {
      font-size: 0.9rem;
    }
  }
  `;

  const CloseModal = styled.button`
    position: absolute;
    top: 10px;
    right: 12px;
    background: crimson;
    color: white;
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

  const ArrowLeft = styled.button`
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border: 2px solid #ccc;
    font-size: 20px;
    border-radius: 50%;
    padding: 6px 10px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
      left: 10px;
    }
  `;

  const ArrowRight = styled(ArrowLeft)`
    left: auto;
    right: -40px;

    @media (max-width: 768px) {
      right: 10px;
    }
  `;
