import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SelectActivity.module.css";
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

const activities = [
  ["Exercise", "Work", "Social", "Community", "Events", "Home"],
  ["Play", "Sports", "Arts", "Cooking", "Comparing", "Music", "Journal"],
  ["TV/ Show", "Stretching", "Called a loved one", "Reading", "Study"],
  ["Nature", "Comedy", "Hobbies", "Playing with Pets", "Treating Yourself"],
  ["Doom scrolling", "Overworking", "Substance Use", "Friends", "Family"],
];

function SelectActivity() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    emotions: emotionResults,
    reflection,
    image,
  } = location.state?.results || {};
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const maxActivities = 5;

  const handleActivityClick = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities((prev) => prev.filter((a) => a !== activity));
    } else if (selectedActivities.length < maxActivities) {
      setSelectedActivities((prev) => [...prev, activity]);
    }
  };

  const handleComplete = async () => {
    if (selectedActivities.length === 0) {
      setError("Please select at least one activity");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      emotions: emotionResults?.map((emotion) => ({
        name: emotion.emotion,
        keywords: emotion.stages,
      })),
      reflection: reflection,
      activities: selectedActivities,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        navigate("/success", {
          state: {
            message: "Your mood check-in has been recorded!",
          },
        });
      } else {
        setError("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("API error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>What did you do today?</h1>
        <p className={styles.subtitle}>Choose upto 5 activities</p>

        <div className={styles.activitiesContainer}>
          {activities.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.activityGroup}>
              {group.map((activity) => (
                <button
                  key={activity}
                  className={`${styles.activityButton} ${
                    selectedActivities.includes(activity) ? styles.selected : ""
                  }`}
                  onClick={() => handleActivityClick(activity)}
                  disabled={
                    !selectedActivities.includes(activity) &&
                    selectedActivities.length >= maxActivities
                  }
                >
                  {activity}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.emotionsContainer}>
          <div className={styles.emotionsLeft}>
            <div className={styles.emotionNames}>
              {emotionResults?.map((emotion, index) => (
                <span key={index}>
                  {emotion.emotion}
                  {index < emotionResults.length - 1 && (
                    <span className={styles.bulletPoint}> • </span>
                  )}
                </span>
              ))}
            </div>
            <div className={styles.emotionsTags}>
              {emotionResults?.map((result) =>
                result.stages.map((stage, idx) => (
                  <span
                    key={`${result.emotion}-${idx}`}
                    className={styles.tag}
                    style={{ backgroundColor: result.color }}
                  >
                    {stage}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className={styles.emotionsRight}>
            {emotionResults?.map((emotion, index) => (
              <div key={index} className={styles.emotionIconWrapper}>
                <img
                  src={emotionIcons[emotion.emotion]}
                  alt={emotion.emotion}
                  className={styles.emotionIcon}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <button
        className={styles.completeButton}
        onClick={handleComplete}
        disabled={loading || selectedActivities.length === 0}
      >
        {loading ? "Submitting..." : "Complete"}
      </button>
    </div>
  );
}

export default SelectActivity;
