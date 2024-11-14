import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/PostDetails.css"; // Make sure to import the CSS

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [newReplyContent, setNewReplyContent] = useState(""); // State for new reply content
  const [user, setUser] = useState(null); // State to store logged-in user data
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate(); // Define navigate function

  const API_URL = process.env.REACT_APP_API_URL; // Get the API URL from environment variable

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach the token to the Authorization header
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
      fetchPost();
      fetchUser();
    } else {
      navigate("/login"); // Redirect to login if no token is present
    }
  }, [postId, token, navigate, API_URL]); // Added API_URL to dependencies

  // Handle new reply submission
  const handleNewReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReplyContent.trim()) {
      setError("Reply content cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newReplyContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      const newReply = await response.json();
      setPost((prevPost) => ({
        ...prevPost,
        replies: [...prevPost.replies, newReply], // Add the new reply to the post's replies
      }));
      setNewReplyContent(""); // Clear the reply input field
    } catch (error) {
      setError("Error submitting reply");
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove the token from localStorage
    navigate("/"); // Redirect to the main page (or login page)
  };

  // Handle back to feed functionality
  const handleBackToFeed = () => {
    navigate("/feed"); // Navigate back to the feed
  };

  if (!post) return <p>Loading...</p>;
  if (error) return <p>Error loading post: {error}</p>;

  return (
    <div>
      {/* Header with user name, log out, and back to feed button */}
      <header className="post-header">
        <div className="header-content">
          {user && <p>Welcome, {user.username}!</p>}
          <div className="header-buttons">
            <button onClick={handleBackToFeed}>Back to Feed</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      {/* Main post card */}
      <div className="post-content">
        <h2>{post.content}</h2>
        <p>
          Posted by: <Link to={`/users/${post.user_id}`}>{post.username}</Link>
        </p>

        {/* Conditional Link: Show 'Return to Parent Post' if there's a parent, otherwise show 'Return to Feed' */}
        <div>
          {post.parent ? (
            <Link to={`/posts/${post.parent}`}>Return to Parent Post</Link>
          ) : (
            <Link to="/feed">Return to Feed</Link>
          )}
        </div>
      </div>

      {/* Replies section */}
      <div className="replies-section">
        <h3>Replies:</h3>
        {post.replies.length > 0 ? (
          post.replies.map((reply) => (
            <div className="reply-card" key={reply._id}>
              <p>{reply.content}</p>
              <p>
                Replied by:{" "}
                <Link to={`/users/${reply.user_id}`}>{reply.username}</Link>
              </p>
              <Link to={`/posts/${reply._id}`}>View Replies</Link>
            </div>
          ))
        ) : (
          <p>No replies yet. Be the first to reply!</p>
        )}
      </div>

      {/* New reply form */}
      <form onSubmit={handleNewReplySubmit}>
        <textarea
          value={newReplyContent}
          onChange={(e) => setNewReplyContent(e.target.value)}
          placeholder="Write a reply..."
          required
        />
        <button type="submit">Submit Reply</button>
      </form>
    </div>
  );
};

export default PostDetails;
