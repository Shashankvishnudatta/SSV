import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import generate
from routes.generations import router as generations_router

load_dotenv()

app = FastAPI(
    title="SSV Vibe Coding Backend",
    description="LLM-powered single-shot static HTML generation engine",
    version="0.1.0",
)

# CORS configuration allowing local dev origins (Vite frontend defaults to port 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",  # Allows access inside Codespaces preview ports
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(generations_router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "SSV Generation Engine"}
