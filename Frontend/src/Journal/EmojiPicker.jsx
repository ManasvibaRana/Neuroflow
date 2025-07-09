import React from "react";
import styled from "styled-components";

const emojis = ["😊", "😢", "😡", "😂", "😴", "🤯", "😍", "🤓", "🥳"];

const EmojiPicker = ({ selectedEmoji, setSelectedEmoji, showEmojis, setShowEmojis }) => {
  return (
    <EmojiContainer>
      <EmojiButton onClick={() => setShowEmojis(!showEmojis)}>{selectedEmoji}</EmojiButton>
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
  );
};

export default EmojiPicker;

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
