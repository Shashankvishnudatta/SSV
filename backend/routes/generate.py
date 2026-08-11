# Add this import at the top of backend/routes/generate.py
from routes.generations import save_generation_to_db

# Inside Person A's POST /generate endpoint logic (after HTML generation succeeds):
@router.post("/generate")
async def generate_site(payload: GenerateRequest, authorization: str = Header(...)):
    # 1. Person A generates HTML...
    # html_doc = generate_html(payload.prompt)
    
    # 2. Person C's Save Logic Hook:
    user_id = get_current_user_id(authorization) # Extract user from JWT
    saved_record = save_generation_to_db(
        user_id=user_id,
        prompt=payload.prompt,
        html=html_doc
    )
    
    return {
        "id": saved_record.get("id"),
        "html": html_doc,
        "created_at": saved_record.get("created_at")
    }