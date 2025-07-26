import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB URI from the environment variable
client = MongoClient(os.getenv("MONGO_URI"))

# Select the database and collection
db = client.consumer_law_bot
collection = db.chat_logs

# Function to log chat history
def log_chat(data: dict):
    """
    Saves chat data to MongoDB.
    
    Args:
    - data (dict): Contains user input and bot response.
    """
    collection.insert_one(data)
