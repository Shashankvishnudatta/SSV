import re
from typing import Optional

def extract_and_clean_html(raw_output: str) -> Optional[str]:
    """
    Extracts valid HTML starting from <!DOCTYPE html> (or <html>) to </html>.
    Handles markdown fences, missing DOCTYPE, or minor token truncation defensively.
    """
    if not raw_output or not raw_output.strip():
        return None

    cleaned = raw_output.strip()

    # 1. Strip markdown fences if present
    fence_match = re.search(r"```(?:html)?\s*(.*?)\s*```", cleaned, re.DOTALL | re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    # 2. Find start tag (<!DOCTYPE html> or <html>)
    start_match = re.search(r"(<!DOCTYPE\s+html.*?>|<html.*?>)", cleaned, re.IGNORECASE | re.DOTALL)
    if not start_match:
        return None

    start_idx = start_match.start()
    cleaned = cleaned[start_idx:]

    # 3. Handle doctype normalization if starting directly with <html>
    if not re.match(r"^<!DOCTYPE\s+html", cleaned, re.IGNORECASE):
        cleaned = "<!DOCTYPE html>\n" + cleaned

    # 4. Find closing </html> tag; if truncated, auto-close defensively
    end_match = re.search(r"</html>", cleaned, re.IGNORECASE)
    if end_match:
        cleaned = cleaned[:end_match.end()]
    else:
        # Append closing tags if truncated near the end
        if "</body" not in cleaned.lower():
            cleaned += "\n</body>"
        cleaned += "\n</html>"

    return cleaned.strip()