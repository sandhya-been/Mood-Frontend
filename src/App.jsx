import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import styles from "./App.module.css";
import background from "./assets/landing/Bg.png";
import backIcon from "./assets/landing/carousel back.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const updateUserName = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userObj = JSON.parse(user);
          setUserName(userObj.name || "");
        } catch {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };
    updateUserName();
    window.addEventListener("storage", updateUserName);
    return () => window.removeEventListener("storage", updateUserName);
  }, [location]);

  const hideWelcome = location.pathname === "/login" || location.pathname === "/signup";
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
  {/* Welcome message removed as requested */}
        <AppRoutes />
        <ToastContainer />
      </main>
    </div>
  );
}

export default App;
