import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/EmotionSlider.module.css";
import angerFace1 from "../../assets/emotionslider/angry1.png";
import angerFace2 from "../../assets/emotionslider/angry2.png";
import angerFace3 from "../../assets/emotionslider/angry3.png";
import sadnessFace1 from "../../assets/emotionslider/sad1.png";
import sadnessFace2 from "../../assets/emotionslider/sad2.png";
import sadnessFace3 from "../../assets/emotionslider/sad3.png";
import happinessFace1 from "../../assets/emotionslider/happy1.png";
import happinessFace2 from "../../assets/emotionslider/happy2.png";
import happinessFace3 from "../../assets/emotionslider/happy3.png";
import feelingsFace1 from "../../assets/emotionslider/neutral1.png";
import feelingsFace2 from "../../assets/emotionslider/neutral2.png";
import feelingsFace3 from "../../assets/emotionslider/neutral3.png";
import aweFace1 from "../../assets/emotionslider/awe1.png";
import aweFace2 from "../../assets/emotionslider/awe2.png";
import aweFace3 from "../../assets/emotionslider/awe3.png";
import contentFace1 from "../../assets/emotionslider/content1.png";
import contentFace2 from "../../assets/emotionslider/content2.png";
import contentFace3 from "../../assets/emotionslider/content3.png";

const emotionColors = {
  Angry: "#ff4a4a",
  Sad: "#6b88c9",
  Neutral: "#7accc8",
  Content: "#ffb356",
  Happy: "#92c582",
  Awe: "#c792ea",
};

function EmotionSlider() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedEmotions = location.state?.selectedMoods || [];

  if (selectedEmotions.length === 0) {
    navigate("/");
    return null;
  }

  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedStages, setSelectedStages] = useState([]);
  const [emotionResults, setEmotionResults] = useState([]);
  const [currentFace, setCurrentFace] = useState(null);
  const [currentStages, setCurrentStages] = useState([]);
  const [visitedEmotions, setVisitedEmotions] = useState([0]);
  const currentEmotion = selectedEmotions[currentEmotionIndex];

  const emotionStagesMap = {
    Angry: {
      low: ["Irritated", "Annoyed", "Frustrated", "Fed Up", "Grumpy", "Touchy"],
      medium: [
        "Resentful",
        "Bitter",
        "Spiteful",
        "Vindictive",
        "Raging",
        "Explosive",
      ],
      high: [
        "Furious",
        "Enraged",
        "Infuriated",
        "Livid",
        "Outraged",
        "Seething",
      ],
      faces: [angerFace1, angerFace2, angerFace3],
      title: "Anger is a complex emotion",
      subtitle: "Identifying your emotions is the first step to releasing them",
    },
    Sad: {
      low: ["Down", "Disappointment", "Listless", "Apathy", "Disheartened"],
      medium: ["Lonely", "Self-Doubt", "Guilt", "Dejected", "Shame", "Hurt"],
      high: ["Grief", "Despair", "Heartache", "Depression", "Abandonment"],
      faces: [sadnessFace1, sadnessFace2, sadnessFace3],
      title: "Sadness is a complex emotion",
      subtitle: "Recognizing your sadness helps you process and heal",
    },
    Neutral: {
      low: ["Blank", "Apathetic", "Detached", "Good", "Indifferent", "Okay"],
      medium: [
        "Unbiased",
        "Casual",
        "Objective",
        "Unbothered",
        "Present",
        "Coasting",
      ],
      high: ["Stoic", "Centering", "Zen", "Balanced", "Grounded", "Equanimous"],
      faces: [feelingsFace1, feelingsFace2, feelingsFace3],
      title: "Neutrality is a complex emotion",
      subtitle: "Identifying your emotions is the first step to releasing them",
    },
    Content: {
      low: ["Calm", "Settled", "Okay", "At Ease", "Composed", "Relieved"],
      medium: [
        "Comfortable",
        "Pleased",
        "Secure",
        "Present",
        "Balanced",
        "Assured",
      ],
      high: [
        "Fulfilled",
        "Serene",
        "Gratified",
        "Connected",
        "Whole",
        "Satisfied",
      ],
      faces: [contentFace1, contentFace2, contentFace3],
      title: "Contentment is a complex emotion",
      subtitle: "Identifying your emotions is the first step to releasing them",
    },
    Happy: {
      low: ["Cheerful", "Warm", "Playful", "Amused", "Lighthearted", "Chipper"],
      medium: [
        "Happy",
        "Excited",
        "Energetic",
        "Motivated",
        "Proud",
        "Hopeful",
      ],
      high: [
        "Euphoric",
        "Blissful",
        "Delighted",
        "Triumphant",
        "Radiant",
        "Elated",
      ],
      faces: [happinessFace1, happinessFace2, happinessFace3],
      title: "Happiness is a complex emotion",
      subtitle: "Identifying your emotions is the first step to releasing them",
    },
    Awe: {
      low: ["Curious", "Intrigued", "Interested", "Engaged", "Observant"],
      medium: ["Impressed", "Absorbed", "Tingling", "Wondering", "Humbled"],
      high: ["Awestruck", "Speechless", "Shaken", "Enlightened", "Exalted"],
      faces: [aweFace1, aweFace2, aweFace3],
      title: "Awe is a complex emotion",
      subtitle: "Identifying your emotions is the first step to releasing them",
    },
  };

  const getCurrentStages = () => {
    const emotion = emotionStagesMap[currentEmotion];
    if (!emotion) return [];

    if (sliderValue <= 33) {
      return emotion.low;
    } else if (sliderValue <= 66) {
      return emotion.medium;
    }
    return emotion.high;
  };

  const getCurrentFace = () => {
    const emotion = emotionStagesMap[currentEmotion];
    if (!emotion) return null;

    if (sliderValue <= 33) {
      return emotion.faces[0];
    } else if (sliderValue <= 66) {
      return emotion.faces[1];
    }
    return emotion.faces[2];
  };

  useEffect(() => {
    if (!currentEmotion) return;

    setCurrentFace(getCurrentFace());
    setCurrentStages(getCurrentStages());
    setSelectedStages([]);
  }, [sliderValue, currentEmotion]);

  useEffect(() => {
    if (!visitedEmotions.includes(currentEmotionIndex)) {
      const lastVisited = Math.max(...visitedEmotions);
      setCurrentEmotionIndex(lastVisited);
    }
  }, [currentEmotionIndex, visitedEmotions]);

  const handleStageClick = (stage) => {
    setSelectedStages((prev) => {
      if (prev.includes(stage)) {
        return prev.filter((s) => s !== stage);
      }
      return [...prev, stage];
    });
  };


  const handleComplete = () => {
    if (selectedStages.length === 0) return;

    const currentResult = {
      emotion: currentEmotion,
      intensity: sliderValue,
      stages: selectedStages,
      color: emotionColors[currentEmotion],
    };

    setEmotionResults((prev) => [...prev, currentResult]);

    if (currentEmotionIndex < selectedEmotions.length - 1) {
      setVisitedEmotions((prev) => [...prev, currentEmotionIndex + 1]);
      setCurrentEmotionIndex((prev) => prev + 1);
      setSliderValue(0);
      setSelectedStages([]);
    } else {
      navigate("/emotion-results", {
        state: {
          emotionResults: [...emotionResults, currentResult],
        },
      });
    }
  };

  const currentColor = emotionColors[currentEmotion] || "#ff4a4a";

  // const renderActionButtons = () => (
  //   <div className={styles.actionButtons}>
  //     <button
  //       className={`${styles.continueBtn} ${
  //         selectedStages.length === 0 ? styles.disabled : ""
  //       }`}
  //       disabled={selectedStages.length === 0}
  //       onClick={handleComplete}
  //       style={{
  //         opacity: selectedStages.length === 0 ? 0.5 : 1,
  //         cursor: selectedStages.length === 0 ? "not-allowed" : "pointer",
  //       }}
  //     >
  //       {currentEmotionIndex === selectedEmotions.length - 1
  //         ? "Complete"
  //         : "Continue"}
  //     </button>
  //   </div>
  // );

  const canNavigateBack = currentEmotionIndex > 0;

  const handleNavigateBack = () => {
    if (canNavigateBack) {
      setCurrentEmotionIndex((prev) => prev - 1);
      const previousResult = emotionResults[currentEmotionIndex - 1];
      if (previousResult) {
        setSliderValue(previousResult.intensity);
        setSelectedStages(previousResult.stages);
      }
    }
  };

  const handleAddEmotion = () => {
    const currentProgress = {
      emotionResults,
      currentIndex: currentEmotionIndex,
      selectedEmotions,
    };
    sessionStorage.setItem("emotionProgress", JSON.stringify(currentProgress));

    navigate("/selectmoods");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.emotionContainer}>
          <div className={styles.navigationHeader}>
            {canNavigateBack && (
              <button
                className={styles.backButton}
                onClick={handleNavigateBack}
              >
                ← Previous Emotion
              </button>
            )}
            <p className={styles.progress}>
              Emotion {currentEmotionIndex + 1} of {selectedEmotions.length}
            </p>
          </div>
          <div>
            <h1 className={styles.title}>
              {emotionStagesMap[currentEmotion]?.title ||
                `${currentEmotion} Intensity`}
            </h1>
            <p className={styles.subtitle}>
              {emotionStagesMap[currentEmotion]?.subtitle ||
                "Explore how you feel"}
            </p>
          </div>

          <img
            src={currentFace}
            alt={`${currentEmotion} face`}
            className={styles.emotionFace}
          />

          <div className={styles.sliderContainer}>
            <span>Slightly {currentEmotion}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className={styles.slider}
              style={{
                background: `linear-gradient(to right, #ffe5e5, ${currentColor})`,
              }}
            />
            <span>Very {currentEmotion}</span>
          </div>

          <div className={styles.stagesContainer}>
            <p className={styles.stagesTitle}>
              What stage is your {currentEmotion.toLowerCase()} in?
            </p>
            <div className={styles.stageButtons}>
              {currentStages.map((stage) => (
                <button
                  key={stage}
                  className={`${styles.stageButton} ${
                    selectedStages.includes(stage) ? styles.selected : ""
                  }`}
                  onClick={() => handleStageClick(stage)}
                  style={{
                    borderColor: selectedStages.includes(stage)
                      ? currentColor
                      : "#ddd",
                    backgroundColor: selectedStages.includes(stage)
                      ? currentColor
                      : "white",
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.addEmotionBtn} onClick={handleAddEmotion}>
            Add Emotion
          </button>
          <button
            className={styles.continueBtn}
            disabled={selectedStages.length === 0}
            onClick={handleComplete}
          >
            {currentEmotionIndex === selectedEmotions.length - 1
              ? "Complete"
              : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmotionSlider;
