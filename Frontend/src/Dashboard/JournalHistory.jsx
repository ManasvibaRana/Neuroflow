import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';


// --- The Main Component ---

const JournalHistory = () => {
  const [journalData, setJournalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState("Select a date to see your entry.");

  // --- NEW: State for the image gallery ---
  const [images, setImages] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // --- NEW: Helper functions for the image modal ---
  const openImage = (src) => setEnlargedImage(src);
  const closeImage = () => setEnlargedImage(null);

  useEffect(() => {
    fetchJournalForDate(selectedDate);
  }, [selectedDate]);

  const fetchJournalForDate = (date) => {
    const token = sessionStorage.getItem("token");
    const userid = sessionStorage.getItem("userid");

    if (token && userid) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Reset state before fetching
      setJournalData(null);
      setImages([]); // <-- NEW: Reset images
      setMessage("Loading...");

      axios
        .get(`http://localhost:8000/journal/history/${userid}/${formattedDate}/`, {
           headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const data = res.data;
          if (data.message) {
            setMessage(data.message);
            setJournalData(null);
          } else {
            setJournalData(data);
            setMessage("");

            // --- NEW: Handle incoming images from the backend ---
            if (data.images && Array.isArray(data.images)) {
              // Prepend server URL if necessary
              const formattedImages = data.images.map(img => 
                img.image.startsWith('http') ? img.image : `http://localhost:8000${img.image}`
              );
              setImages(formattedImages);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.status === 404) {
            setMessage("No journal found for this date.");
          } else {
            setMessage("Error fetching data. Please try again.");
          }
          setJournalData(null);
        });
    } else {
        setMessage("Please log in to view your history.");
    }
  };

  return (
    <>
     
      <Main>
        <CalendarWrapper>
          <h2>Journal History</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            maxDate={new Date()}
          />
        </CalendarWrapper>

        <JournalDisplay>
          {message && !journalData && <Message>{message}</Message>}

          {journalData && (
            <JournalCard>
              <JournalHeader>
                <span className="journal-date">
                  {new Date(journalData.created_at).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
                <span className="journal-emoji">{journalData.emotion_emoji}</span>
              </JournalHeader>
              <Notebook>
                <JournalText>{journalData.text}</JournalText>
              </Notebook>

              {/* --- NEW: Image Gallery Display --- */}
              {images.length > 0 && (
                <Gallery>
                  <h3>📷 Memories</h3>
                  <PolaroidGrid>
                    {images.map((src, i) => {
                      const rotation = (Math.random() * 6 - 3).toFixed(2);
                      return (
                        <Polaroid key={i} $rotate={rotation} onClick={() => openImage(src)}>
                          <img src={src} alt={`memory-${i}`}/>
                        </Polaroid>
                      );
                    })}
                  </PolaroidGrid>
                </Gallery>
              )}
            </JournalCard>
          )}
        </JournalDisplay>
      </Main>

      {/* --- NEW: Enlarged Image Modal --- */}
      {enlargedImage && (
        <Overlay onClick={closeImage}>
          <CloseButton onClick={closeImage}>✕</CloseButton>
          <ModalImage
            src={enlargedImage}
            alt="Enlarged memory"
            onClick={(e) => e.stopPropagation()}
          />
        </Overlay>
      )}
    </>
  );
};

export default JournalHistory;

// --- STYLED COMPONENTS ---

const Main = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const CalendarWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  
  .react-calendar {
    border: none;
    font-family: 'Inter', sans-serif;
  }

  h2 {
    text-align: center;
    font-size: 20px;
    color: #333;
    margin-top: 0;
  }
`;

const JournalDisplay = styled.div`
  flex: 1;
  width: 100%;
  max-width: 700px;
`;

const JournalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;

  .journal-date {
    font-weight: bold;
    color: #333;
  }

  .journal-emoji {
    font-size: 28px;
  }
`;

const Notebook = styled.div`
  width: 100%;
  min-height: 300px;
  position: relative;
  background: linear-gradient(135deg, #d0eefd, #f0f8ff);
  border-radius: 12px;
  font-family: 'Caveat', cursive;
  display: flex;
  flex-direction: column;
  padding: 1.4rem 1rem 1.4rem 70px;
  box-sizing: border-box;
`;

const JournalText = styled.p`
  flex: 1;
  border: none;
  resize: none;
  background: transparent;
  outline: none;
  font-size: 18px;
  line-height: 1.6rem;
  white-space: pre-wrap;
  margin: 0;
  color: #333;
`;

const Message = styled.p`
  text-align: center;
  font-size: 18px;
  color: #777;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 12px;
`;

// --- NEW: Gallery Styled Components ---

const Gallery = styled.div`
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #eee;

  h3 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
    color: #555;
  }
`;

const PolaroidGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
`;

const Polaroid = styled.div`
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  transform: rotate(${(props) => props.$rotate}deg);
  cursor: zoom-in;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05) rotate(${(props) => props.$rotate}deg);
    z-index: 10;
  }

  img {
    width: 100%;
    display: block;
    border: 1px solid #eee;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(5px);
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
  z-index: 1000;
  color: #333;
`;