import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Feed.css"; // Import the CSS file for styling

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); // State for private post checkbox
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;

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
        setPosts(postsData);
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
      navigate("/login");
    }
  }, [token, navigate, API_URL]);

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
        body: JSON.stringify({ content: newPostContent, private: isPrivate }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent("");
      setIsPrivate(false);
    } catch (error) {
      setError("Error creating post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts: {error}</p>;

  return (
    <div>
      {/* Header with user name and buttons */}
      <header className="post-header">
        <div className="header-content">
          {user && <p>Welcome, {user.username}!</p>}
          <div className="header-buttons">
            <button onClick={() => navigate("/search")}>Search</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
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
        <div className="private-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
            Private
          </label>
        </div>
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
