import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/EmotionResults.module.css";
import { BsImageFill } from "react-icons/bs";
import skipIcon from "../../assets/landing/carousel front.png";
import angryIcon from "../../assets/moods/angry.png";
import sadIcon from "../../assets/moods/sad.png";
import neutralIcon from "../../assets/moods/neutral.png";
import contentIcon from "../../assets/moods/content.png";
import happyIcon from "../../assets/moods/happy.png";
import aweIcon from "../../assets/moods/awe.png";

const emotionIcons = {
  Angry: angryIcon,
  Sad: sadIcon,
  Neutral: neutralIcon,
  Content: contentIcon,
  Happy: happyIcon,
  Awe: aweIcon,
};

function EmotionResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emotionResults } = location.state || { emotionResults: [] };
  const [text, setText] = useState("");
  const maxChars = 500;

  const handleTextChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
    }
  };

  const handleComplete = () => {
    const finalResults = {
      emotions: emotionResults,
      reflection: text,
    };
    navigate("/select-activity", { state: { results: finalResults } });
  };

  const handleSkip = () => {
    const finalResults = {
      emotions: emotionResults,
      reflection: text,
    };
    navigate("/select-activity", { state: { results: finalResults } });
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.skipButton} onClick={handleSkip}>
        <span>Skip</span>
        <img src={skipIcon} alt="Skip" className={styles.skipIcon} />
      </button>

      <div className={styles.mainContainer}>
        <h1 className={styles.title}>What is making you feel this way?</h1>

        <div className={styles.textareaContainer}>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="I feel this way because...."
            className={styles.textarea}
            maxLength={maxChars}
          />
          <div className={styles.charCount}>
            {text.length}/{maxChars} characters
          </div>
        </div>

        <div className={styles.emotionsSection}>
          <div className={styles.emotionNames}>
            {emotionResults.map((emotion, index) => (
              <span key={index} className={styles.emotionName}>
                {emotion.emotion}
                {index < emotionResults.length - 1 && " • "}
              </span>
            ))}
          </div>

          <div className={styles.emotionIcons}>
            {emotionResults.map((emotion, index) => (
              <img
                key={index}
                src={emotionIcons[emotion.emotion]}
                alt={emotion.emotion}
                className={styles.emotionIcon}
              />
            ))}
          </div>
        </div>
        <div className={styles.keywordsSection}>
          {emotionResults.map((emotion) =>
            emotion.stages.map((stage, idx) => (
              <span
                key={`${emotion.emotion}-${idx}`}
                className={styles.keyword}
                style={{ backgroundColor: emotion.color }}
              >
                {stage}
              </span>
            ))
          )}
        </div>
      </div>

      <button className={styles.completeButton} onClick={handleComplete}>
        Complete
      </button>
    </div>
  );
}

export default EmotionResults;
