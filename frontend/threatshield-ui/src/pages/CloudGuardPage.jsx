import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './ContentPage.css';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

function CloudGuardPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setScanResult(null);
    setSelectedFile(event.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert("Please select a file to scan.");
      return;
    }
    setIsLoading(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append('configFile', selectedFile);

    try {
      // API call to the Node.js backend on port 3001
      const response = await axios.post('http://localhost:3001/api/scan/cloud-config', formData);
      setScanResult(response.data);
    } catch (error) {
      console.error("Error scanning file:", error);
      alert("Failed to scan the file. Please ensure all backend services are running.");
    }
    setIsLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>Cloud Guard</h1>
          <p>Scan your cloud infrastructure configuration files for vulnerabilities.</p>
        </header>
        <main className="content-card">
          <div className="file-uploader">
            <label htmlFor="file-upload" className="file-upload-label">
              <FaFileUpload />
              <span>{selectedFile ? selectedFile.name : 'Choose a configuration file...'}</span>
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} />
            <button className="scan-button" onClick={handleScan} disabled={isLoading || !selectedFile}>
              {isLoading ? <FaSpinner className="spinner" /> : 'Scan Now'}
            </button>
          </div>
          {scanResult && (
            <div className="results-container">
              <h3 className="results-title">Scan complete for: {scanResult.fileName}</h3>
              {scanResult.misconfigurations && scanResult.misconfigurations.length > 0 ? (
                <ul className="results-list">
                  {scanResult.misconfigurations.map((item, index) => (
                    <li key={index} className={`result-item ${item.severity.toLowerCase()}`}>
                      <span className="severity-tag">{item.severity}</span>
                      <p className="message">{item.message} <span className="rule-id">({item.ruleId})</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-issues-found">✅ No misconfigurations found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CloudGuardPage;