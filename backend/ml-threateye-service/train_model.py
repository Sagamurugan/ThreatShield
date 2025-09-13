import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

print("Training ThreatEye model...")
# In a real project, use a large dataset. For the hackathon, this is fine.
data = {
    'url': [
        'google.com', 'youtube.com', 'facebook.com', 'wikipedia.org',
        'verify-your-account-now.com/login.html', 'win-free-iphone.net/claim-prize',
        'update.your.paypal.info-scam.com/security', 'bankofamerica.com-details.org/login'
    ],
    'label': [0, 0, 0, 0, 1, 1, 1, 1] # 0 = Safe, 1 = Malicious
}
df = pd.DataFrame(data)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['url'])
y = df['label']

model = LogisticRegression()
model.fit(X, y)

joblib.dump(model, 'url_model.pkl')
joblib.dump(vectorizer, 'url_vectorizer.pkl')
print("✅ Model and vectorizer saved successfully!")