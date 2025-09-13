import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './ContentPage.css'; // We use the same shared CSS
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

// Mock scan results for the demo
const mockResults = {
  fileName: "user-behavior-dataset.csv",
  anomalies: [
    { ruleId: 'ANO-001', severity: 'Critical', message: 'Potential data poisoning detected: significant shift in feature distribution.' },
    { ruleId: 'OUT-003', severity: 'High', message: 'Extreme outliers found in "transaction_amount" column.' },
    { ruleId: 'D-TYPE-002', severity: 'Warning', message: 'Inconsistent data types found in "user_age" column.' },
  ]
};

function AIGuardPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setScanResult(null);
    setSelectedFile(event.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert("Please select a dataset file to scan.");
      return;
    }
    setIsLoading(true);
    setScanResult(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show mock results
    setScanResult(mockResults);

    setIsLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>AI Model Guard</h1>
          <p>Scan AI datasets (.csv) for anomalies and signs of data poisoning.</p>
        </header>

        <main className="content-card">
          <div className="file-uploader">
            <label htmlFor="file-upload" className="file-upload-label">
              <FaFileUpload />
              <span>{selectedFile ? selectedFile.name : 'Choose a dataset file (.csv)...'}</span>
            </label>
            <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
            
            <button className="scan-button" onClick={handleScan} disabled={isLoading || !selectedFile}>
              {isLoading ? <FaSpinner className="spinner" /> : 'Scan Dataset'}
            </button>
          </div>

          {scanResult && (
            <div className="results-container">
              <h3 className="results-title">Scan complete for: {scanResult.fileName}</h3>
              <ul className="results-list">
                {scanResult.anomalies.map((item, index) => (
                  <li key={index} className={`result-item ${item.severity.toLowerCase()}`}>
                    <span className="severity-tag">{item.severity}</span>
                    <p className="message">{item.message} <span className="rule-id">({item.ruleId})</span></p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AIGuardPage;