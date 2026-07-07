from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model at startup
model = joblib.load("priority_model.joblib")

@app.route("/predict-priority", methods=["POST"])
def predict_priority():
    data = request.get_json() or {}

    title = data.get("title", "")
    description = data.get("description", "")
    category = data.get("category", "")

    # Combine into one text like in training
    text = f"{title} {description} {category}"

    # Predict class (High/Medium/Low)
    predicted_priority = model.predict([text])[0]

    # Get probability for a "confidence score"
    proba = model.predict_proba([text])[0]
    score = max(proba) * 100  # 0–100

    return jsonify({
        "priority": predicted_priority,
        "aiScore": int(score)
    })

if __name__ == "__main__":
    # Runs on http://localhost:5001
    app.run(host="0.0.0.0", port=5001)
