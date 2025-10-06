import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { RiHome5Line, RiPulseLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import profileboy from "../assets/landing/profileboy.png";
import profilegirl from "../assets/landing/profilegirl.png";
import avatar from "../assets/landing/Top.png";


function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('user');
  const [profileImage, setProfileImage] = useState(profileboy);
  useEffect(() => {
    const updateProfileImage = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
          fetch(`https://api.genderize.io?name=${encodeURIComponent(user.name.split(' ')[0])}`)
            .then(res => res.json())
            .then(data => {
              if (data.gender === 'female') {
                setProfileImage(profilegirl);
              } else {
                setProfileImage(profileboy);
              }
            })
            .catch(() => setProfileImage(profileboy));
        } else {
          setProfileImage(profileboy);
        }
      } catch {
        setProfileImage(profileboy);
      }
    };
    updateProfileImage();
    const onStorage = (e) => {
      if (e.key === 'user') updateProfileImage();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location]);

  useEffect(() => {
    const updateUserName = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userObj = JSON.parse(user);
          setUserName(userObj && userObj.name ? userObj.name : "User");
        } catch {
          setUserName("User");
        }
      } else {
        setUserName("");
      }
    };
    updateUserName();
    window.addEventListener("storage", updateUserName);
    return () => window.removeEventListener("storage", updateUserName);
  }, [location]);


  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserName("");
    navigate('/'); 
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

  const hideProfile = location.pathname === "/login" || location.pathname === "/signup";
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

      {!hideProfile && (
        <div className={styles.userProfile} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <img src={profileImage} alt="Avatar" className={styles.profileImage} />
              <span className={styles.userName} style={{ marginTop: 4 }}>{userName || "User"}</span>
              {isExpanded && (
                <button
                  className={styles.logoutButton}
                  style={{ marginTop: 8, padding: '4px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#0a9cf0ff', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
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
      )}
    </aside>
  );
}

export default Sidebar;
