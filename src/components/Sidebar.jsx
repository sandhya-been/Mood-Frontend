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
  const navigate = useNavigate();

  const menuItems = [
    { icon: <RiHome5Line />, label: "Dashboard", path: "/" },
    { icon: <RiPulseLine />, label: "Activity", path: "/activity" },
    { icon: <RiPlayCircleLine />, label: "Resources", path: "/resources" },
    { icon: <BsChatDots />, label: "Counseling", path: "/counseling" },
    { icon: <FaUsers />, label: "Community", path: "/community" },
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

      <div className={styles.userProfile}>
        <img src={avatar2} alt="Avatar" className={styles.profileImage} />
        {isExpanded && <span className={styles.userName}>Sandhya S</span>}
      </div>
    </aside>
  );
}

export default Sidebar;
