import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/User.css"; // Ensure you import the CSS file for styling

const User = () => {
  const { userId } = useParams(); // Get userId from the URL parameters
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();  // Use navigate to handle redirects

  const API_URL = process.env.REACT_APP_API_URL; // Get the API URL from environment variable

  // Fetch user data and their posts in one request
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, { // Use environment variable for the API URL
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData); // The response will have both user data and posts
      } catch (error) {
        setError("Error fetching user data");
      }
    };

    if (token) {
      fetchUserData();
    } else {
      navigate("/login");  // Redirect to login if no token is found
    }
  }, [userId, token, navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove the token from localStorage
    navigate("/");  // Redirect to the main page (or login page)
  };

  const handleBackToFeed = () => {
    navigate("/feed");  // Navigate back to the feed
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>; // Wait for user data to be fetched

  return (
    <div>
      {/* Header with user name and logout button */}
      <header className="feed-header">
        <div className="header-content">
          <p>Welcome, {user.username}!</p> {/* Show username */}
        </div>

        {/* Header buttons: Back to Feed and Log Out */}
        <div className="header-buttons">
          <button onClick={handleBackToFeed}>Back to Feed</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      {/* User Posts */}
      <section>
        <h3>{user.username}'s Posts</h3>
        {user.posts && user.posts.length > 0 ? (
          user.posts.map((post) => (
            <div key={post._id} className="post-card">
              <h4>{post.content}</h4>
              <p>Posted on: {new Date(post.timestamp).toLocaleDateString()}</p>
              <Link to={`/posts/${post._id}`}>View Post</Link>
            </div>
          ))
        ) : (
          <p>No posts to show</p>
        )}
      </section>
    </div>
  );
};

export default User;
