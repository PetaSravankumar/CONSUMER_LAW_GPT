import axios from 'axios'; // Import axios for making HTTP requests

// Function that sends a POST request to your FastAPI chatbot backend
export const getBotReply = async (user_input: string, history: any[] = []) => {
  // Make a POST request to http://localhost:8000/chat
  const res = await axios.post('http://localhost:8000/chat', {
    user_input,  // The user's message
    history      // Previous chat messages (if any)
  });

  // Return the bot's reply
  return res.data;
};
