import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  // 🔧 Add more fields as needed
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired, please login again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    try {
      const res = await axiosInstance.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (err: any) {
      console.error("❌ Unauthorized", err.response?.data);
      alert("Session expired, please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

      {user ? (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* ✏️ Add more fields if needed */}

          {/* ✅ Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Profile;
