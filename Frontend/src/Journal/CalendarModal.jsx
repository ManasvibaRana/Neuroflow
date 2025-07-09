import React from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

Modal.setAppElement("#root");

const formatDate = (date) => date.toISOString().split("T")[0];

const CalendarModal = ({ isOpen, onClose, onDateSelect, journalData }) => {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Select Journal Date"
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
    >
      <h2 style={{ marginBottom: "16px" }}>📅 View Journal by Date</h2>
      <Calendar
        onClickDay={(date) => {
          onDateSelect(date);
          onClose();
        }}
        tileContent={({ date, view }) => {
          const key = formatDate(date);
          const entry = journalData?.[key];
          return view === "month" && entry ? (
            <div style={{ fontSize: "1.2rem", textAlign: "center" }}>
              {entry.emoji}
            </div>
          ) : null;
        }}
      />
      <CloseButton onClick={onClose}>❌ Close</CloseButton>
    </StyledModal>
  );
};

export default CalendarModal;

// Styled Modal
const StyledModal = styled(Modal)`
  background: #fffefa;
  padding: 24px;
  border-radius: 16px;
  width: fit-content;
  margin: auto;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;
