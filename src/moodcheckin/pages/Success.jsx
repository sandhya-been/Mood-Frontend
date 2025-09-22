import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Success.module.css";
import characterImg from "../../assets/Success/succesicon.png";
import subtractBg from "../../assets/landing/Subtract.png";
import recommendationsImg from "../../assets/Success/recommendimg.png";
import reminderImg from "../../assets/Success/set remainder.png";
import confetti from "canvas-confetti";

function Success() {
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

useEffect(() => {
  if (!imageLoaded) return;

  const emojiDetails = {
    userId: localStorage.getItem('userId'), 
    emojis: ["😊", "😢", "😡"] 
  };

  
  fetch("http://localhost:5000/api/user/emojis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emojiDetails),
  })
    .then((res) => res.json())
    .then((data) => {
      // Optionally handle response
      console.log("Emoji details stored:", data);
    })
    .catch((err) => {
      console.error("Error storing emoji details:", err);
    });

  const interval = setInterval(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });
  }, 5000);

  return () => clearInterval(interval);
}, [imageLoaded]);

  const handleReminderClick = () => {
    setShowReminder(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      setShowReminder(false);
    }
  };

  const handleAnalyticsClick = () => {
    navigate("/analytics");
  };
  
  const handleImageLoad = (e) => {
    e.target.style.opacity = '1';
    setImageLoaded(true);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${subtractBg})` }}
      >
        <div className={styles.content}>
          <img src={characterImg} alt="Success" className={styles.character} />

          <h1 className={styles.title}>Great job completing your session!</h1>
          <p className={styles.subtitle}>
            Want to make this a habit? Set a reminder for next time.
          </p>

          <div className={styles.actionButtons}>
            <button
              className={styles.reminderButton}
              onClick={handleReminderClick}
            >
              Set Reminder
            </button>
            <button
              className={styles.analyticsButton}
              onClick={handleAnalyticsClick}
            >
              View Analytics
            </button>
          </div>

          {/* Recommendations section removed as requested */}

        </div>
      </div>

      {/* Reminder Modal */}
      {showReminder && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={`${styles.modalContent} ${styles.slideUp}`}>
            <img
              src={reminderImg}
              alt="Set Reminder"
              className={styles.reminderImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Success;
