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
        emotion: emotion.emotion,
        intensity: emotion.intensity,
        stages: emotion.stages,
        color: emotion.color,
      })),
      reflection: reflection,
      activities: selectedActivities,
    };

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token || !userData._id) { // Check for _id
        setError("Please login again");
        navigate('/login');
        return;
      }

      const response = await fetch("http://localhost:5000/api/moods/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          ...payload,
          userId: userData._id // Use the stored _id
        })
      });

      if (response.ok) {
        navigate("/success", {
          state: {
            message: "Your mood check-in has been recorded!"
          }
        });
      } else if (response.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('user'); // Clear invalid token
        setError("Session expired. Please login again");
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit. Please try again.");
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
