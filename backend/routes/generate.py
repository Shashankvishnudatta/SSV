from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone
from services.llm_client import generate_html_from_prompt, LLMGenerationError

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Natural language prompt for website generation")

class GenerateResponse(BaseModel):
    id: str
    html: str
    created_at: str

@router.post(
    "/generate", 
    response_model=GenerateResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Generate a static HTML/CSS website from a natural language prompt"
)
async def generate_website(payload: GenerateRequest):
    clean_prompt = payload.prompt.strip()
    if not clean_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Prompt cannot be empty."
        )

    try:
        generated_html = await generate_html_from_prompt(clean_prompt)
    except LLMGenerationError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation failed: {str(err)}"
        )

    generation_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # TODO: Person C — save generation to Supabase here

    return GenerateResponse(
        id=generation_id,
        html=generated_html,
        created_at=created_at
    )