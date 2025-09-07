import styles from "../styles/SelectMoods.module.css";
import angry from "../../assets/moods/angry.png";
import sad from "../../assets/moods/sad.png";
import neutral from "../../assets/moods/neutral.png";
import content from "../../assets/moods/content.png";
import happy from "../../assets/moods/happy.png";
import awe from "../../assets/moods/awe.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SelectMoods() {
  const navigate = useNavigate();
  const [selectedMoods, setSelectedMoods] = useState([]);

  useEffect(() => {
    const savedProgress = sessionStorage.getItem("emotionProgress");
    if (savedProgress) {
      const { selectedEmotions } = JSON.parse(savedProgress);
      setSelectedMoods(selectedEmotions);
    }
  }, []);

  const moods = [
    { name: "Angry", icon: angry },
    { name: "Sad", icon: sad },
    { name: "Neutral", icon: neutral },
    { name: "Content", icon: content },
    { name: "Happy", icon: happy },
    { name: "Awe", icon: awe },
  ];

  const toggleMood = (moodName) => {
    setSelectedMoods((prev) =>
      prev.includes(moodName)
        ? prev.filter((mood) => mood !== moodName)
        : [...prev, moodName]
    );
  };

  const handleComplete = () => {
    if (selectedMoods.length > 0) {
      const savedProgress = sessionStorage.getItem("emotionProgress");
      let existingResults = [];

      if (savedProgress) {
        const { emotionResults } = JSON.parse(savedProgress);
        existingResults = emotionResults;
        sessionStorage.removeItem("emotionProgress");
      }

      navigate("/emotion-slider", {
        state: {
          selectedMoods,
          existingResults,
        },
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-start min-h-[100vh] overflow-y-auto">
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>How are you feeling today?</h1>
          <p className={styles.subtitle}>
            No matter how you're feeling, it's okay. We're here to support you.
          </p>

          <div className={styles.moodGrid}>
            {moods.map((mood) => (
              <button
                key={mood.name}
                className={`${styles.moodButton} ${
                  selectedMoods.includes(mood.name) ? styles.selected : ""
                }`}
                onClick={() => toggleMood(mood.name)}
              >
                <img
                  src={mood.icon}
                  alt={mood.name}
                  className={styles.moodIcon}
                />
              </button>
            ))}
          </div>

          <p className={styles.helper}>
            Select one or more feelings that match how you are feeling
          </p>
        </div>

        <button
          className={styles.completeButton}
          disabled={selectedMoods.length === 0}
          onClick={handleComplete}
        >
          Complete
        </button>
      </div>
    </div>
  );
}

export default SelectMoods;
