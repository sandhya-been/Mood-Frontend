import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import styles from "./App.module.css";
import background from "./assets/landing/Bg.png";
import backIcon from "./assets/landing/carousel back.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className={styles.appLayout}>
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <main
        className={`${styles.contentArea} ${
          isSidebarExpanded ? styles.expanded : ""
        }`}
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src={backIcon} alt="Back" />
            Back
          </button>
        </div>
        <AppRoutes />
        <ToastContainer />
      </main>
    </div>
  );
}

export default App;
