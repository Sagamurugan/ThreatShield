from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# This function contains the logic to scan the file
def scan_aws_policy(policy_data):
    misconfigurations = []
    try:
        policy = json.loads(policy_data)
        for statement in policy.get('Statement', []):
            if (statement.get('Effect') == 'Allow' and statement.get('Principal') == '*'):
                misconfigurations.append({
                    'ruleId': 'IAM-001', 'severity': 'Critical', 'message': 'Policy allows public access with Principal "*".'
                })
        # Add more rules here to make your scanner smarter
    except json.JSONDecodeError:
        return [{'ruleId': 'JSON-001', 'severity': 'High', 'message': 'Invalid JSON format.'}]
    
    return misconfigurations

# This is the API endpoint that receives the file
@app.route('/scan-cloud-config', methods=['POST'])
def scan_cloud_config():
    if 'configFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['configFile']
    file_content = file.read().decode('utf-8')
    print(f"[Python Service] Received file: {file.filename}")
    
    results = scan_aws_policy(file_content)
    
    return jsonify({
        'fileName': file.filename,
        'misconfigurations': results
    })

if __name__ == '__main__':
    # Run this service on port 5002
    app.run(host='0.0.0.0', port=5002, debug=True)