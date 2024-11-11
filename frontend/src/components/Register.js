import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For displaying success or error messages

  const API_URL = process.env.REACT_APP_API_URL; // Get the API URL from environment variable

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the registration request to your FastAPI backend
      const response = await axios.post(
        `${API_URL}/users/`, // Use the API URL from environment variable
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // On successful registration, show success message
      setMessage("Registration successful! Redirecting to login...");
      
      // After 2 seconds, redirect to the login page
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000);
    } catch (error) {
      // Handle errors (e.g., if the username already exists)
      setMessage("Error: " + (error.response?.data?.detail || "Registration failed."));
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>} {/* Show success or error message */}
    </div>
  );
};

export default Register;
