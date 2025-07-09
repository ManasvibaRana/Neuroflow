import React from "react";
import styled from "styled-components";

const Notebook = ({ text, setText, theme, fontFamily, themes }) => {
  return (
    <NotebookContainer>
      <NotebookStyle
        style={{
          background: themes[theme].notebookBackground,
          fontFamily,
        }}
      >
        <textarea
          placeholder="Write your journal..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="margin" />
      </NotebookStyle>
    </NotebookContainer>
  );
};

export default Notebook;

const NotebookContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const NotebookStyle = styled.div`
  position: relative;
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
