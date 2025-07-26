from typing import List, Dict
import re
from translator import detect_language, translate_to_native

def build_prompt(user_query: str, history: List[Dict[str, str]]) -> str:
    greetings = {"hi", "hello", "hey", "namaste", "hlo"}
    unrelated_keywords = {"job", "passport", "exam", "interview", "loan", "visa", "study"}
    abusive_words = {"idiot", "mad", "stupid", "bastard", "shit", "fuck"}

    detected_lang = detect_language(user_query)
    query_lower = user_query.lower().strip()

    # Rule 1: Greeting-only
    if query_lower in greetings:
        if detected_lang == "te":
            return "నమస్తే! వినియోగదారుల హక్కుల గురించి మీకు ఏం సహాయం కావాలి?"
        elif detected_lang == "ta":
            return "வணக்கம்! இந்திய நுகர்வோர் சட்டம் குறித்து என்னால் எவ்வாறு உதவ முடியும்?"
        else:
            return "Hello! How can I help you with your Indian consumer law query?"

    # Rule 2: Abusive content
    if any(word in query_lower for word in abusive_words):
        return "⚠️ I cannot respond to abusive language. I can help only with Indian consumer law matters."

    # Rule 3: Unrelated topics
    if any(word in query_lower for word in unrelated_keywords):
        return "Sorry, I can only assist with questions related to Indian consumer law."

    # Rule 4: Valid consumer query - Return structured legal steps
    steps = [
        "1: Take a photo of the product, MRP tag, and bill.\n\n",
        "2: Politely tell the shopkeeper that overcharging MRP is illegal.\n\n",
        "3: If not resolved, file a complaint with the District Consumer Commission.\n\n",
        "**References:** Section 2(1)(r), 10, 12 - Consumer Protection Act, 2019; IPC Section 420\n\n",
        "**Consumer Helpline:** Call 1800-11-4000 or visit https://consumerhelpline.gov.in"
    ]

    final_output = "".join(steps).strip()

    # Translate to native language if needed
    if detected_lang != "en":
        return translate_to_native(final_output, detected_lang)

    return final_output
