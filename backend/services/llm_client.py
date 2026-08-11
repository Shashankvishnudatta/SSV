import os
import httpx
from typing import Tuple
from prompts.system_prompt import CURRENT_SYSTEM_PROMPT
from services.html_cleaner import extract_and_clean_html

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash")

class LLMGenerationError(Exception):
    """Custom exception for errors during LLM communication or validation."""
    pass

async def call_openrouter_api(system_prompt: str, user_prompt: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise LLMGenerationError("OPENROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/SSV-Vibe-Coding",
        "X-Title": "SSV Vibe Coding Engine"
    }

    payload = {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 4096
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        try:
            response = await client.post(OPENROUTER_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except httpx.TimeoutException:
            raise LLMGenerationError("LLM API request timed out after 45 seconds.")
        except httpx.HTTPStatusError as e:
            raise LLMGenerationError(f"OpenRouter API error ({e.response.status_code}): {e.response.text}")
        except Exception as e:
            raise LLMGenerationError(f"Unexpected API error: {str(e)}")

async def generate_html_from_prompt(user_prompt: str) -> str:
    raw_response = await call_openrouter_api(CURRENT_SYSTEM_PROMPT, user_prompt)
    cleaned_html = extract_and_clean_html(raw_response)

    if cleaned_html:
        return cleaned_html

    # Attempt 2: Strict retry prompt
    retry_reminder = (
        f"{user_prompt}\n\n"
        "[CRITICAL REQUIREMENT]: Respond ONLY with raw HTML code starting with `<!DOCTYPE html>` and ending with `</html>`. "
        "Do not use markdown backticks."
    )
    raw_retry_response = await call_openrouter_api(CURRENT_SYSTEM_PROMPT, retry_reminder)
    cleaned_retry_html = extract_and_clean_html(raw_retry_response)

    if cleaned_retry_html:
        return cleaned_retry_html

    print(f"\n--- DEBUG RAW LLM OUTPUT ---\n{raw_response}\n---------------------------\n")
    raise LLMGenerationError("Failed to extract valid HTML structure from LLM output.")