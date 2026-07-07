from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class TextIn(BaseModel):
    text: str

@app.post("/predict")
async def predict(payload: TextIn):
    text = (payload.text or "").lower()
    priority = "Low"
    tags: List[str] = []

    if any(k in text for k in ["emerg", "accident", "injury", "hospital", "fire", "death"]):
        priority = "High"
    elif any(k in text for k in ["no water", "no electricity", "leak", "broken", "collapse", "road blocked"]):
        priority = "Medium"

    if "water" in text: tags.append("water")
    if "road" in text or "drain" in text: tags.append("road")
    if "electric" in text or "light" in text: tags.append("electricity")
    if "health" in text or "hospital" in text: tags.append("health")
    if "garbage" in text or "sanitation" in text: tags.append("sanitation")

    # de-dupe tags
    tags = list(dict.fromkeys(tags))
    return {"priority": priority, "tags": tags}
