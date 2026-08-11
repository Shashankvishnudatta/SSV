import os
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

# Supabase Client Initialization
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase environment variables missing")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Dependency: Extract and verify User ID from JWT Token
def get_current_user_id(authorization: str = Header(...), supabase: Client = Depends(get_supabase)) -> str:
    try:
        token = authorization.replace("Bearer ", "").strip()
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized access")

# Request/Response Schemas
class GenerationSummary(BaseModel):
    id: str
    prompt: str
    created_at: str

class GenerationDetail(BaseModel):
    id: str
    prompt: str
    html: str
    created_at: str

# GET /generations -> List past generations for logged-in user
@router.get("/generations", response_model=List[GenerationSummary])
async def list_generations(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    try:
        response = supabase.table("generations") \
            .select("id, prompt, created_at") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

# GET /generations/{id} -> Fetch specific full generation
@router.get("/generations/{generation_id}", response_model=GenerationDetail)
async def get_generation(
    generation_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    try:
        response = supabase.table("generations") \
            .select("*") \
            .eq("id", generation_id) \
            .eq("user_id", user_id) \
            .single() \
            .execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Generation not found")
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Generation not found or unauthorized")

# Helper function for Person A's /generate endpoint
def save_generation_to_db(user_id: str, prompt: str, html: str, generation_id: Optional[str] = None) -> dict:
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "prompt": prompt,
        "html": html
    }
    if generation_id:
        data["id"] = generation_id
    response = supabase.table("generations").insert(data).execute()
    return response.data[0] if response.data else {}