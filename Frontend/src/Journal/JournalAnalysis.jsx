import React, { forwardRef } from "react";
import styled from "styled-components";

const JournalAnalysis = forwardRef(({ analysisResult, onSignUpClick, onLoginClick, background }, ref) => {
  if (!analysisResult) return null;

  return (
    <HighlightCard ref={ref} background={background}>
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

      <p>🧠 Key Insight:</p>
      <InsightScroll>
        <em>"{analysisResult.highlight}"</em>
      </InsightScroll>

      {!sessionStorage.getItem("token") && (
        <CallToAction>
          🔒 To save this journal and unlock productivity insights,{" "}
          <span onClick={onSignUpClick} className="link">Sign up</span> or{" "}
          <span onClick={onLoginClick} className="link">Log in</span>.
        </CallToAction>
      )}
    </HighlightCard>
  );
});

export default JournalAnalysis;

const HighlightCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 14px;
  background: ${(props) => props.$background || "#ffffffee"};  // ✅ use $background
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #333;
  width: 100%;
  max-width: 640px;
  animation: fadeIn 0.5s ease-in-out;

  h4 {
    margin-bottom: 12px;
    color: #2a7bc3;
  }

  p {
    font-size: 0.95rem;
    color: #444;
  }

  .link {
    color: #007BFF;
    font-weight: bold;
    cursor: pointer;
  }
`;

const EmotionBar = styled.div`
  margin: 10px 0;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
  height: 18px;
`;

const Bar = styled.div`
  background: linear-gradient(to right, #76c7c0, #52a7b3);
  height: 100%;
  transition: width 0.5s ease;
`;

const Score = styled.span`
  margin-left: 8px;
  min-width: 40px;
  text-align: right;
  font-size: 0.85rem;
  color: #555;
`;

const InsightScroll = styled.div`
  max-height: 90px;
  overflow-y: auto;
  margin-top: 10px;
  background: #fdfdfd;
  padding: 12px 16px;
  border-left: 4px solid #87CEFA;
  border-radius: 8px;
  font-style: italic;
  line-height: 1.5;
  font-size: 0.95rem;
  color: #555;
  animation: fadeIn 0.5s ease-in-out;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 8px;
  }
`;

const CallToAction = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 12px;

  .link {
    color: #007BFF;
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
  }
`;
