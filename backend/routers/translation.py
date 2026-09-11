from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from google import genai
import os

router = APIRouter(prefix="/api", tags=["translation"])

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    target_language: str = Field(..., min_length=2, max_length=10)

@router.post("/translate")
async def translate_text(payload: TranslationRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Server security configuration error.")
        
    client = genai.Client(api_key=api_key)
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Translate the following text accurately into {payload.target_language}. Return only the translated text without extra commentary:\n\n{payload.text}"
        )
        return {
            "status": "success",
            "translated_text": response.text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Secure translation execution failed.")