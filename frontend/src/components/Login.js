import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import the external CSS for styling

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL; // Access API URL from environment variable

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/login`, // Use the environment variable for the URL
        new URLSearchParams({
          username,
          password,
          grant_type: "password",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("access_token", response.data.access_token);

      setMessage("Login successful! Redirecting to feed...");
      setTimeout(() => {
        navigate("/feed");
      }, 2000);
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.detail || "Login failed."));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-login">Login</button>
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Register here</button>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
