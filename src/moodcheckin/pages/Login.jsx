import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    let name = "";
    const users = localStorage.getItem("users"); 
    if (users) {
      try {
        const usersArr = JSON.parse(users);
        const found = usersArr.find(u => u.email === email);
        if (found && found.name) name = found.name;
      } catch {}
    }
    if (!name) name = email;
    localStorage.setItem("user", JSON.stringify({ name, email }));
    navigate("/");
  };

  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span className={styles.link} onClick={() => navigate("/")}>Sign up</span>
      </p>
    </div>
  );
}

export default Login;
