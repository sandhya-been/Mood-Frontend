import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Success.module.css";
import characterImg from "../../assets/Success/succesicon.png";
import subtractBg from "../../assets/landing/Subtract.png";
import confetti from "canvas-confetti";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${subtractBg})` }}
      >
        <div className={styles.content}>
          <img
            src={characterImg}
            alt="Success"
            className={styles.character}
          />

          <h1 className={styles.title}>Great job completing your session!</h1>
          
          <p className={styles.subtitle}>
            Thank you for sharing. Remember to check in tomorrow to continue your well-being journey!
          </p>
          
          <button
            className={styles.dashboardButton}
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;