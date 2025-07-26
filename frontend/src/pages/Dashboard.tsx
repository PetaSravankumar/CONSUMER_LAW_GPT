import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Centralized Axios instance
import ChatBox from "../components/ChatBox"; // Import the ChatBox component

const Dashboard = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Send a GET request using the centralized axios instance
        const res = await axiosInstance.get("/user/dashboard", {
          // Include credentials if using httpOnly cookies (for refresh token)
          withCredentials: true,
        });

        // Assuming the server returns a 'msg' property in the response
        setMessage(res.data.msg || "No message returned from server.");
      } catch (err: any) {
        console.error("❌ Unauthorized or error fetching:", err);
        alert("Session expired or invalid token. Please login again.");
        
        // Clear tokens and navigate to login page
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-lg mt-2">✅ {message}</p>
      )}

      {/* Use the ChatBox component here */}
      <ChatBox />
    </div>
  );
};

export default Dashboard;
