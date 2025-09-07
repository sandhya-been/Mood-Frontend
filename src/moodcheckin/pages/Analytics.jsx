import { useNavigate } from "react-router-dom";
import styles from "../styles/Analytics.module.css";
import calendar1 from "../../assets/Success/calendar1.png";
import calendar2 from "../../assets/Success/calendar2.png";

function Analytics() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>

      <div className={styles.content}>
        <div className={styles.mainCalendar}>
          <img
            src={calendar1}
            alt="Monthly Calendar"
            className={styles.calendarMain}
          />
        </div>

        <div className={styles.sideCalendar}>
          <img
            src={calendar2}
            alt="Mood Stats"
            className={styles.calendarStats}
          />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
