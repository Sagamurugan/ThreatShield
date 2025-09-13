from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model and vectorizer at startup
model = joblib.load('url_model.pkl')
vectorizer = joblib.load('url_vectorizer.pkl')
print("[Python ThreatEye] Model loaded.")

@app.route('/scan', methods=['POST'])
def scan_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'URL not provided'}), 400

    url_to_scan = data['url']
    print(f"[Python ThreatEye] Scanning URL: {url_to_scan}")

    # Use the model to predict
    url_vectorized = vectorizer.transform([url_to_scan])
    prediction = model.predict(url_vectorized)
    probability = model.predict_proba(url_vectorized)

    is_malicious = bool(prediction[0])
    risk_score = int(probability[0][1] * 100)

    return jsonify({
        'url': url_to_scan,
        'is_malicious': is_malicious,
        'risk_score': risk_score
    })

if __name__ == '__main__':
    # Run this service on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)