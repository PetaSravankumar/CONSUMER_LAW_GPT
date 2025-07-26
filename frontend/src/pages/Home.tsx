// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // 🔐 Remove token
    navigate('/login');               // 🔁 Redirect to login page
  };

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onLogout={handleLogout} />
      </div>

      {/* Main content below navbar and above chat input */}
      <div className="pt-[64px] pb-[80px]">
        <ChatBox />
      </div>
    </>
  );
};

export default Home;
