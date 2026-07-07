import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# 1. LOAD DATA
df = pd.read_csv("complaints_training.csv")

# 2. PREPARE TEXT (title + description + category)
df["text"] = (
    df["title"].fillna("") + " " +
    df["description"].fillna("") + " " +
    df["category"].fillna("")
)

X = df["text"]
y = df["priority"]   # labels: High / Medium / Low

# 3. SPLIT INTO TRAIN / TEST
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. ML PIPELINE
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression(max_iter=1000))
])

# 5. TRAIN
model.fit(X_train, y_train)

# 6. EVALUATE
acc = model.score(X_test, y_test)
print("Model accuracy:", acc)

# 7. SAVE MODEL
joblib.dump(model, "priority_model.joblib")
print("✅ Saved priority_model.joblib")
