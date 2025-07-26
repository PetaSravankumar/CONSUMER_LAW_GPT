from langdetect import detect
from deep_translator import GoogleTranslator

# Supported languages list
SUPPORTED_LANGUAGES = ["en", "hi", "ta", "te", "ml", "kn", "mr", "gu", "bn", "pa", "ur"]

# Detect language of input
def detect_language(text: str) -> str:
    lang = detect(text)
    return lang if lang in SUPPORTED_LANGUAGES else "en"

# Translate to English (LLM input)
def translate_to_english(text: str, source_lang: str) -> str:
    if source_lang == 'en':
        return text
    return GoogleTranslator(source=source_lang, target='en').translate(text)

# Translate back to user language (LLM output)
def translate_to_native(text: str, target_lang: str) -> str:
    if target_lang == 'en':
        return text
    return GoogleTranslator(source='en', target=target_lang).translate(text)
