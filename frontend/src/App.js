import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';  // Import Login component
import Feed from './components/Feed';    // Import Feed component
import Register from './components/Register';
import User from './components/User'
import PostDetail from "./components/PostDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:postId" element={<PostDetail />} /> {/* Route for post detail */}
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/users/:userId" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
