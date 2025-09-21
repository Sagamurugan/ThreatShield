# # from flask import Flask, request, jsonify
# # import json
# # import pandas as pd

# # app = Flask(__name__)

# # def scan_aws_policy(policy_data):
# #     misconfigurations = []
# #     try:
# #         policy = json.loads(policy_data)
# #         for statement in policy.get('Statement', []):
# #             if (statement.get('Effect') == 'Allow' and statement.get('Principal') == '*'):
# #                 misconfigurations.append({
# #                     'ruleId': 'IAM-001', 'severity': 'Critical', 'message': 'Policy allows public access with Principal "*".'
# #                 })
# #     except json.JSONDecodeError:
# #         return [{'ruleId': 'JSON-001', 'severity': 'High', 'message': 'Invalid JSON format.'}]
# #     return misconfigurations

# # def scan_ai_dataset(file_stream):
# #     anomalies = []
# #     try:
# #         df = pd.read_csv(file_stream)
# #         for col in df.columns:
# #             if df[col].nunique() <= 1:
# #                 anomalies.append({
# #                     'ruleId': 'ANO-001', 'severity': 'Warning', 'message': f'Column "{col}" has only one unique value.'
# #                 })
# #         for col in df.select_dtypes(include=['number']).columns:
# #             mean = df[col].mean()
# #             std = df[col].std()
# #             if not pd.isna(std) and std > 0:
# #                 outliers = df[abs(df[col] - mean) > (3 * std)]
# #                 if not outliers.empty:
# #                     anomalies.append({
# #                         'ruleId': 'OUT-003', 'severity': 'High', 'message': f'Found {len(outliers)} potential outliers in column "{col}".'
# #                     })
# #     except Exception as e:
# #         anomalies.append({'ruleId': 'CSV-001', 'severity': 'Critical', 'message': f'Failed to parse CSV file: {e}'})
# #     return anomalies

# # @app.route('/scan-cloud-config', methods=['POST'])
# # def handle_cloud_scan():
# #     if 'configFile' not in request.files: return jsonify({'error': 'No file part'}), 400
# #     file = request.files['configFile']
# #     file_content = file.read().decode('utf-8')
# #     results = scan_aws_policy(file_content)
# #     return jsonify({'fileName': file.filename, 'misconfigurations': results})

# # @app.route('/scan-ai-dataset', methods=['POST'])
# # def handle_ai_scan():
# #     if 'datasetFile' not in request.files:
# #         return jsonify({'error': 'No datasetFile part'}), 400
# #     file = request.files['datasetFile']
# #     print(f"[Python Service] Received dataset: {file.filename}")
# #     results = scan_ai_dataset(file)
# #     return jsonify({'fileName': file.filename, 'anomalies': results})

# # if __name__ == '__main__':
# #     app.run(host='0.0.0.0', port=5002, debug=True)



# # from flask import Flask, request, jsonify
# # import pickle
# # from flask_cors import CORS # Import CORS

# # app = Flask(__name__)
# # CORS(app) # This enables Cross-Origin Resource Sharing

# # # Load your pre-trained model and vectorizer
# # try:
# #     with open('url_vectorizer.pkl', 'rb') as f:
# #         vectorizer = pickle.load(f)
# #     with open('url_model.pkl', 'rb') as f:
# #         model = pickle.load(f)
# # except FileNotFoundError:
# #     vectorizer = None
# #     model = None

# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     if not model or not vectorizer:
# #         return jsonify({'error': 'Model not loaded'}), 500

# #     data = request.get_json()
# #     url_to_check = data.get('url')

# #     if not url_to_check:
# #         return jsonify({'error': 'URL not provided'}), 400

# #     # Use the model to predict the probability
# #     url_vector = vectorizer.transform([url_to_check])
# #     malicious_prob = model.predict_proba(url_vector)[0][1]
# #     risk_score = int(malicious_prob * 100)
    
# #     # Return the score AND the original URL
# #     return jsonify({
# #         'url': url_to_check, 
# #         'risk_score': risk_score
# #     })

# # if __name__ == '__main__':
# #     app.run(port=5002, debug=True)



# from flask import Flask, request, jsonify
# import pickle
# from flask_cors import CORS # Import CORS

# app = Flask(__name__)
# # Enable Cross-Origin Resource Sharing to allow your React app to make requests
# CORS(app) 

# # Load your pre-trained model and vectorizer when the server starts
# try:
#     with open('url_vectorizer.pkl', 'rb') as f:
#         vectorizer = pickle.load(f)
#     with open('url_model.pkl', 'rb') as f:
#         model = pickle.load(f)
# except FileNotFoundError:
#     print("ERROR: Model or vectorizer file not found. Make sure .pkl files are in the same directory.")
#     vectorizer = None
#     model = None

# def analyze_url_features(url):
#     """Analyzes a URL for simple, rule-based red flags."""
#     reasons = []
#     # Reason 1: Check for HTTPS
#     if not url.startswith('https://'):
#         reasons.append({'type': 'Warning', 'message': 'Does not use a secure connection (HTTPS).'})
    
#     # Reason 2: Check for suspicious keywords often used in phishing
#     suspicious_keywords = ['login', 'secure', 'account', 'update', 'verify', 'signin']
#     if any(keyword in url.lower() for keyword in suspicious_keywords):
#         reasons.append({'type': 'Warning', 'message': 'Contains suspicious keywords.'})

#     # Reason 3: Check URL length
#     if len(url) > 75:
#         reasons.append({'type': 'Warning', 'message': 'URL is unusually long.'})

#     # Reason 4: If no major warnings, give a positive reason
#     if not reasons:
#         reasons.append({'type': 'Info', 'message': 'URL uses a standard format and secure connection.'})
        
#     return reasons

# @app.route('/predict', methods=['POST'])
# def predict():
#     if not model or not vectorizer:
#         return jsonify({'error': 'Model not loaded on the server'}), 500

#     data = request.get_json()
#     url_to_check = data.get('url')

#     if not url_to_check:
#         return jsonify({'error': 'URL not provided in the request'}), 400

#     # Use the model to predict the probability of it being malicious
#     url_vector = vectorizer.transform([url_to_check])
#     malicious_prob = model.predict_proba(url_vector)[0][1]
#     risk_score = int(malicious_prob * 100)
    
#     # Analyze for specific features/reasons to add context
#     reasons = analyze_url_features(url_to_check)
    
#     # Return a complete JSON response
#     return jsonify({
#         'url': url_to_check, 
#         'risk_score': risk_score,
#         'reasons': reasons
#     })

# if __name__ == '__main__':
#     # Make sure to run on the correct port that your API gateway expects
#     app.run(port=5002, debug=True)





"""
ML Guard Service
This Flask application provides two main functionalities:
1. Scanning of configuration files for hardcoded secrets.
2. Scanning of AI datasets (.csv files) for Personally Identifiable Information (PII).
It runs on port 5002 to align with the API Gateway configuration.
"""

# --- 1. DEPENDENCIES ---
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import io

# --- 2. INITIALIZATION ---
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# --- 3. CORE LOGIC ---

def find_secrets_in_config(file_stream):
    """Reads a file stream and scans for potential hardcoded secrets using regex."""
    findings = []
    try:
        # Read the file line by line, ignoring potential decoding errors
        content = file_stream.read().decode('utf-8', errors='ignore')
        lines = content.split('\n')

        secret_patterns = {
            "API Key": r'api[_-]?key\s*=\s*["\'](.*?)["\']',
            "Password": r'pass(word)?\s*=\s*["\'](.*?)["\']',
            "Private Key": r'-----BEGIN (RSA|EC) PRIVATE KEY-----'
        }

        for i, line in enumerate(lines):
            for key, pattern in secret_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    findings.append({
                        "line": i + 1,
                        "type": "Hardcoded Secret",
                        "message": f"Potential {key} found on this line."
                    })
        
        if not findings:
            findings.append({"type": "Info", "message": "No obvious hardcoded secrets found."})

    except Exception as e:
        findings.append({"type": "Error", "message": f"Could not process file: {e}"})

    return findings

def find_pii_in_dataset(file_stream):
    """Reads a CSV file stream into a pandas DataFrame and scans for PII."""
    findings = []
    try:
        # Use io.StringIO to treat the byte stream as a text file for pandas
        csv_data = io.StringIO(file_stream.read().decode('utf-8', errors='ignore'))
        df = pd.read_csv(csv_data)

        pii_patterns = {
            "Email Address": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "Phone Number": r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        }

        for col in df.columns:
            # Check if column has string data, otherwise skip
            if pd.api.types.is_string_dtype(df[col]):
                for i, cell in df[col].dropna().items():
                    for key, pattern in pii_patterns.items():
                        if re.search(pattern, str(cell)):
                            findings.append({
                                "row": i + 2, # +1 for header, +1 for 0-indexing
                                "column": col,
                                "type": "PII Detected",
                                "message": f"Potential {key} found."
                            })
        
        if not findings:
            findings.append({"type": "Info", "message": "No common PII (emails, phone numbers) found in the dataset."})

    except Exception as e:
        findings.append({"type": "Error", "message": f"Could not process CSV file: {e}"})

    return findings

# --- 4. API ROUTES ---

@app.route('/scan-cloud-config', methods=['POST'])
def scan_cloud_config_route():
    if 'configFile' not in request.files:
        return jsonify({'error': 'No file part named "configFile"'}), 400
    
    file = request.files['configFile']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    findings = find_secrets_in_config(file.stream)
    return jsonify({'fileName': file.filename, 'findings': findings})

@app.route('/scan-ai-dataset', methods=['POST'])
def scan_ai_dataset_route():
    if 'datasetFile' not in request.files:
        return jsonify({'error': 'No file part named "datasetFile"'}), 400
    
    file = request.files['datasetFile']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    findings = find_pii_in_dataset(file.stream)
    return jsonify({'fileName': file.filename, 'findings': findings})

# --- 5. START SERVER ---
if __name__ == '__main__':
    # Run on port 5002 to match the API Gateway configuration
    app.run(port=5002, debug=True)