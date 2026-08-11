import pytest
from fastapi.testclient import TestClient
from main import app
from services.html_cleaner import extract_and_clean_html

client = TestClient(app)

# --- 1. Endpoint Unit Tests ---

def test_generate_empty_prompt():
    """Empty prompts must return 400 Bad Request."""
    response = client.post("/generate", json={"prompt": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "Prompt cannot be empty."

def test_generate_missing_field():
    """Missing prompt field must fail pydantic validation (422)."""
    response = client.post("/generate", json={})
    assert response.status_code == 422


# --- 2. HTML Cleaner Unit Tests ---

def test_cleaner_strips_markdown_fences():
    raw_llm = "```html\n<!DOCTYPE html><html><body><h1>Hello</h1></body></html>\n```"
    cleaned = extract_and_clean_html(raw_llm)
    assert cleaned == "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>"

def test_cleaner_adds_missing_doctype():
    raw_llm = "<html><head><title>Test</title></head><body>Content</body></html>"
    cleaned = extract_and_clean_html(raw_llm)
    assert cleaned.startswith("<!DOCTYPE html>")
    assert "</html>" in cleaned

def test_cleaner_heals_truncated_html():
    raw_llm = "<!DOCTYPE html><html><body><div class='main'>Truncated content without end tags"
    cleaned = extract_and_clean_html(raw_llm)
    assert cleaned.endswith("</body>\n</html>")

def test_cleaner_returns_none_for_invalid_input():
    raw_llm = "Sorry, I cannot generate a website for this request."
    cleaned = extract_and_clean_html(raw_llm)
    assert cleaned is None


# --- 3. End-to-End LLM Generation Test ---

def test_generate_endpoint_success():
    """Test generating a simple landing page end-to-end."""
    response = client.post(
        "/generate",
        json={"prompt": "Simple personal portfolio for a software engineer"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert "created_at" in data
    assert data["html"].startswith("<!DOCTYPE html>")
    assert "</html>" in data["html"]