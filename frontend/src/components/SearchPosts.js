import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostDetails.css"; // Reuse the PostDetails CSS for the header styling
import "../styles/SearchPosts.css"; // Create and import a specific CSS file for SearchPosts if needed

const SearchPosts = () => {
  const [searchQuery, setSearchQuery] = useState({ username: "", content: "" });
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [API_URL, token, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // Build the JSON body dynamically with optional fields
      const requestBody = { private: false };
      if (searchQuery.username.trim()) {
        requestBody.username = searchQuery.username;
      }
      if (searchQuery.content.trim()) {
        requestBody.content = { $regex: searchQuery.content };
      }

      const response = await fetch(`${API_URL}/posts/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError("Error performing search");
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div>
      {/* Header with user name and log out button */}
      <header className="post-header">
        <div className="header-content">
          {user && <p>Welcome, {user.username}!</p>}
          <div className="header-buttons">
            <button onClick={() => navigate("/feed")}>Back to Feed</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery.username}
          onChange={(e) =>
            setSearchQuery((prev) => ({ ...prev, username: e.target.value }))
          }
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search content"
          value={searchQuery.content}
          onChange={(e) =>
            setSearchQuery((prev) => ({ ...prev, content: e.target.value }))
          }
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Display search results */}
      <div className="search-results">
        {error && <p className="error-message">{error}</p>}
        {results.length > 0 ? (
          results.map((post) => (
            <div key={post._id} className="post-card">
              <h3>{post.content}</h3>
              <p>Posted by: {post.username}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPosts;
