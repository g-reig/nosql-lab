import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Feed.css"; // Import the CSS file for styling

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState(""); // State for new post content
  const [user, setUser] = useState(null); // State to store logged-in user data
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL; // Access API URL from environment variable

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData = await response.json();
        if (Array.isArray(postsData)) {
          setPosts(postsData);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
      fetchPosts();
      fetchUser();
    } else {
      navigate("/login");  // Redirect to login if no token is present
    }
  }, [token, navigate, API_URL]);

  // Handle new post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post at the beginning of the list
      setNewPostContent(""); // Clear the input field
    } catch (error) {
      setError("Error creating post");
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove the token from localStorage
    navigate("/");  // Redirect to the main page (or login page)
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts: {error}</p>;

  return (
    <div>
      {/* Header with user name and logout button */}
      <header className="feed-header">
        <div className="header-content">
          {user && <p>Welcome, {user.username}!</p>}
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      {/* New post form */}
      <form onSubmit={handleNewPostSubmit} className="new-post-form">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit">Create Post</button>
      </form>

      <h2>Feed</h2>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.content}</h3>
            <p>
              Posted by: 
              <Link to={`/users/${post.user_id}`} className="post-author">{post.username}</Link>
            </p>
            <Link to={`/posts/${post._id}`} className="post-link">View Post</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
