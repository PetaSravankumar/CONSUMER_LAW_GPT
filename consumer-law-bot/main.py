from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat_prompt import build_prompt
from translator import detect_language, translate_to_english, translate_to_native
from db import log_chat
from datetime import datetime
import os
import uuid
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# ✅ CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Session Model
class UserSession:
    def __init__(self):
        self.user_id = str(uuid.uuid4())
        self.chat_sessions = {}
        self.active_session = None

    def start_new_session(self):
        session_id = str(uuid.uuid4())
        self.chat_sessions[session_id] = []
        self.active_session = session_id

    def switch_session(self, session_id):
        self.active_session = session_id

    def get_active_session(self):
        return self.chat_sessions.get(self.active_session, [])

    def get_session_history(self, session_id):
        return self.chat_sessions.get(session_id, [])

# Initialize session storage
user_sessions = UserSession()

# Request Body Model for Chat Input
class ChatRequest(BaseModel):
    message: str

# Chat endpoint
@app.post("/chat")
async def chat_handler(data: ChatRequest):
    user_input = data.message

    # Detect and translate user input
    lang = detect_language(user_input)
    translated_input = translate_to_english(user_input, lang)

    # Get chat history (or start new session if none exists)
    session_history = user_sessions.get_active_session()

    # ✅ Check if the same query was asked earlier in English, return translated response
    for entry in reversed(session_history):
        previous_input_en = entry["translated_input"].strip().lower() if "translated_input" in entry else entry["user"].strip().lower()
        current_input_en = translated_input.strip().lower()

        if previous_input_en == current_input_en:
            return {"response": translate_to_native(entry["bot"], lang)}

    # Build the prompt for the model
    prompt = build_prompt(translated_input, session_history)

    # Call LLM API for response
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}]
    }

    # Make request to Groq API
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)

    # Handle the API response
    if response.status_code != 200:
        bot_reply = "⚠️ LLM service failed: " + response.text
        reply_en = ""
    else:
        reply_en = response.json()["choices"][0]["message"]["content"]
        bot_reply = translate_to_native(reply_en, lang)

    # Store chat history in session
    session_history.append({
        "user": user_input,
        "bot": bot_reply,
        "translated_input": translated_input  # ✅ Store translated form for future comparison
    })

    # Log chat in the database
    log_chat({
        "user_id": user_sessions.user_id,
        "session_id": user_sessions.active_session,
        "user_input": user_input,
        "translated_input": translated_input,
        "language": lang,
        "llm_response": reply_en,
        "translated_response": bot_reply,
        "timestamp": datetime.utcnow()
    })

    # ✅ Return a dictionary with 'response' key
    return {"response": bot_reply}

# Endpoint to start new session
@app.post("/start_session")
async def start_new_session():
    user_sessions.start_new_session()
    return {"message": "New chat session started", "session_id": user_sessions.active_session}

# Endpoint to switch between sessions
@app.post("/switch_session")
async def switch_session(session_id: str):
    user_sessions.switch_session(session_id)
    return {"message": f"Switched to session {session_id}", "session_id": user_sessions.active_session}

# Endpoint to list all sessions
@app.get("/sessions")
async def get_sessions():
    return {"sessions": user_sessions.chat_sessions}