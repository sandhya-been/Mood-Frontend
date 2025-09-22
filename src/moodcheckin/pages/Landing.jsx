import styles from "../styles/Landing.module.css";
import { useNavigate } from "react-router-dom";
import group from "../../assets/landing/Group.png";
import subtract from "../../assets/landing/Subtract.png";
import tickIcon from "../../assets/landing/check read.png";
import handIcon from "../../assets/landing/Select.png";
import vectorIcon from "../../assets/landing/Vector.png";
import profileboy from "../../assets/landing/profileboy.png";
import profilegirl from "../../assets/landing/profilegirl.png";

function Landing() {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}
  // Determine profile image based on user type
  let profileImage = null;
  if (user && user.profileType === "boy") {
    profileImage = profileboy;
  } else if (user && user.profileType === "girl") {
    profileImage = profilegirl;
  }
  const handleStartCheckin = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/selectmoods");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div
          className={styles.cardWrapper}
          style={{ backgroundImage: `url(${subtract})` }}
        >
          <div className={styles.cardContent}>
            {/* Show profile image if user is logged in */}
            {profileImage && (
              <img src={profileImage} alt="Profile" className={styles.profileImage} />
            )}
            <img src={group} alt="Book emoji" className={styles.emoji} />
            <h1 className={styles.title}>Instructions</h1>
            <p className={styles.subtitle}>
              Welcome to the Stress scale. This is a quiz to identify our stress
              levels ranging from high to low and navigate through such
              situations.
            </p>
            <ul className={styles.instructions}>
              <li>
                <img src={tickIcon} alt="tick" className={styles.iconImage} />
                Read the statements carefully and relate to each of the
                statements.
              </li>
              <li>
                <img src={handIcon} alt="hand" className={styles.iconImage} />
                Choose the option which best describes your mood.
              </li>
            </ul>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.startButton}
                onClick={handleStartCheckin}
              >
                Start Check-in
              </button>
              <img
                src={vectorIcon}
                alt="vector"
                className={styles.vectorIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
