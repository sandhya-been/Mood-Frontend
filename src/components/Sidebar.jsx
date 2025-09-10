import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { RiHome5Line, RiPulseLine, RiPlayCircleLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { BsChatDots, BsBell } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import avatar from "../assets/landing/Top.png";
import avatar2 from "../assets/landing/Footer.png";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');

  useEffect(() => {
    // Try to get user name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        // Try to parse as JSON (for new format)
        const userObj = JSON.parse(user);
        if (userObj && userObj.name) {
          setUserName(userObj.name);
        } else if (typeof user === 'string') {
          setUserName(user); // fallback for old format
        }
      } catch {
        setUserName(user); // fallback for old format
      }
    } else {
      setUserName("");
    }
  }, []);

  // Handler for profile click
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserName("");
    navigate('/'); // Redirect to instructions/landing page
  };

  const menuItems = [
    { icon: <RiHome5Line />, label: "Dashboard", path: "/" },
    { icon: <RiPulseLine />, label: "Activity", path: "/activity" },
    { icon: <BsBell />, label: "Notifications", path: "/notifications" },
    { icon: <BiSupport />, label: "Support", path: "/support" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.icon}>
        <img src={avatar} alt="Harmone" />
        {isExpanded && <span style={{ color: "green" }}>Harmone</span>}
      </div>

      <button
        className={styles.expandButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <MdOutlineKeyboardArrowLeft />
        ) : (
          <MdOutlineKeyboardArrowRight />
        )}
      </button>

      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={styles.navItem}
            onClick={() => item.path && navigate(item.path)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {isExpanded && <span className={styles.label}>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={styles.userProfile} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <img src={avatar2} alt="Avatar" className={styles.profileImage} />
            {isExpanded && (
              <>
                <span className={styles.userName}>{userName || "User"}</span>
                <button
                  className={styles.logoutButton}
                  style={{ marginTop: 8, padding: '4px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#0a9cf0ff', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </>
        ) : (
          isExpanded && (
            <>
              <button
                className={styles.logoutButton}
                style={{ margin: '4px 0', padding: '4px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#3c7aeeff', color: '#fff', cursor: 'pointer' }}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className={styles.logoutButton}
                style={{ margin: '4px 0', padding: '4px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#3c7aeeff', color: '#fff', cursor: 'pointer' }}
                onClick={() => navigate('/signup')}
              >
                Signup
              </button>
            </>
          )
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
