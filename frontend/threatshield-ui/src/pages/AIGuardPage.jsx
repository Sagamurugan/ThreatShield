import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './ContentPage.css';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

function AIGuardPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setScanResult(null);
    setSelectedFile(event.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) { alert("Please select a dataset file to scan."); return; }
    setIsLoading(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append('datasetFile', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/scan/ai-dataset', formData);
      setScanResult(response.data);
    } catch (error) {
      console.error("Error scanning dataset:", error);
      alert("Failed to scan the dataset. Are the backend services running?");
    }
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
              {scanResult.anomalies && scanResult.anomalies.length > 0 ? (
                <ul className="results-list">
                  {scanResult.anomalies.map((item, index) => (
                    <li key={index} className={`result-item ${item.severity.toLowerCase()}`}>
                      <span className="severity-tag">{item.severity}</span>
                      <p className="message">{item.message} <span className="rule-id">({item.ruleId})</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-issues-found">✅ No anomalies found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AIGuardPage;