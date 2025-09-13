import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './ContentPage.css';
import { FaSearch, FaSpinner } from 'react-icons/fa';

function ScanResult({ result }) {
    if (!result) return null;
    if (result.error) return <div className="result-item warning"><span className="severity-tag">Error</span><p className="message">{result.error}</p></div>;
  
    const isMalicious = result.risk_score > 70;
    const severity = isMalicious ? 'High' : 'Safe';
  
    return (
      <li className={`result-item ${isMalicious ? 'high' : 'safe'}`}>
        <span className="severity-tag">{severity}</span>
        <p className="message">URL: {result.url} | Risk Score: {result.risk_score}/100</p>
      </li>
    );
}

function ThreatEyePage() {
  const [urlToScan, setUrlToScan] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!urlToScan) {
      alert("Please enter a URL to scan.");
      return;
    }
    setIsLoading(true);
    setScanResult(null);

    try {
        const response = await axios.post('http://localhost:3001/api/scan/url', { url: urlToScan });
        setScanResult(response.data);
    } catch (error) {
        console.error("Error scanning URL:", error);
        setScanResult({ error: "Scan failed. Ensure backend services are running." });
    }

    setIsLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>ThreatEye Scanner</h1>
          <p>Analyze URLs for phishing, malware, and other malicious threats in real-time.</p>
        </header>

        <main className="content-card">
          <div className="url-scanner-input">
            <FaSearch className="input-icon" />
            <input 
              type="text" 
              placeholder="https://example.com" 
              className="settings-input"
              value={urlToScan}
              onChange={(e) => setUrlToScan(e.target.value)}
            />
            <button className="scan-button" onClick={handleScan} disabled={isLoading}>
              {isLoading ? <FaSpinner className="spinner" /> : 'Scan'}
            </button>
          </div>
          
          {scanResult && (
             <div className="results-container">
                <h3 className="results-title">Scan Result</h3>
                <ul className="results-list">
                    <ScanResult result={scanResult} />
                </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ThreatEyePage;