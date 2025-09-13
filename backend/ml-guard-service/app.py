from flask import Flask, request, jsonify
import json
import pandas as pd

app = Flask(__name__)

def scan_aws_policy(policy_data):
    misconfigurations = []
    try:
        policy = json.loads(policy_data)
        for statement in policy.get('Statement', []):
            if (statement.get('Effect') == 'Allow' and statement.get('Principal') == '*'):
                misconfigurations.append({
                    'ruleId': 'IAM-001', 'severity': 'Critical', 'message': 'Policy allows public access with Principal "*".'
                })
    except json.JSONDecodeError:
        return [{'ruleId': 'JSON-001', 'severity': 'High', 'message': 'Invalid JSON format.'}]
    return misconfigurations

def scan_ai_dataset(file_stream):
    anomalies = []
    try:
        df = pd.read_csv(file_stream)
        for col in df.columns:
            if df[col].nunique() <= 1:
                anomalies.append({
                    'ruleId': 'ANO-001', 'severity': 'Warning', 'message': f'Column "{col}" has only one unique value.'
                })
        for col in df.select_dtypes(include=['number']).columns:
            mean = df[col].mean()
            std = df[col].std()
            if not pd.isna(std) and std > 0:
                outliers = df[abs(df[col] - mean) > (3 * std)]
                if not outliers.empty:
                    anomalies.append({
                        'ruleId': 'OUT-003', 'severity': 'High', 'message': f'Found {len(outliers)} potential outliers in column "{col}".'
                    })
    except Exception as e:
        anomalies.append({'ruleId': 'CSV-001', 'severity': 'Critical', 'message': f'Failed to parse CSV file: {e}'})
    return anomalies

@app.route('/scan-cloud-config', methods=['POST'])
def handle_cloud_scan():
    if 'configFile' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['configFile']
    file_content = file.read().decode('utf-8')
    results = scan_aws_policy(file_content)
    return jsonify({'fileName': file.filename, 'misconfigurations': results})

@app.route('/scan-ai-dataset', methods=['POST'])
def handle_ai_scan():
    if 'datasetFile' not in request.files:
        return jsonify({'error': 'No datasetFile part'}), 400
    file = request.files['datasetFile']
    print(f"[Python Service] Received dataset: {file.filename}")
    results = scan_ai_dataset(file)
    return jsonify({'fileName': file.filename, 'anomalies': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)