import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';
import Sidebar from '../components/Sidebar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaSpinner } from 'react-icons/fa';

// Reusable component to display different scan results
function ScanResult({ result, fileName }) {
  if (!result) return null;
  if (result.error) return <div className="widget-result-box error">{result.error}</div>;

  let findings = [];
  if (result.misconfigurations) findings = result.misconfigurations;
  if (result.anomalies) findings = result.anomalies;

  if (fileName) {
    return (
      <div className="widget-result-box info">
        Scan complete for <strong>{fileName}</strong>. Found {findings.length}{' '}
        issues.
      </div>
    );
  }

  if (result.risk_score !== undefined) {
    const isMalicious = result.risk_score > 70;
    return (
      <div className={`widget-result-box ${isMalicious ? 'malicious' : 'safe'}`}>
        Risk Score: {result.risk_score}/100
      </div>
    );
  }

  return null;
}

function DashboardPage() {
  // State for the dynamic risk score
  const [overallRiskScore, setOverallRiskScore] = useState(30); // Start with a safe score

  // State for ThreatEye
  const [urlToScan, setUrlToScan] = useState('');
  const [urlScanResult, setUrlScanResult] = useState(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  // State for Cloud Guard
  const [cloudFileName, setCloudFileName] = useState('');
  const [cloudScanResult, setCloudScanResult] = useState(null);
  const [isCloudLoading, setIsCloudLoading] = useState(false);
  
  // State for AI Guard
  const [aiFileName, setAiFileName] = useState('');
  const [aiScanResult, setAiScanResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- LOGIC TO UPDATE SCORE DYNAMICALLY ---
  useEffect(() => {
    if (!urlScanResult || urlScanResult.error) return;
    const scoreChange = urlScanResult.is_malicious ? 20 : -5;
    setOverallRiskScore(prevScore => Math.max(0, Math.min(100, prevScore + scoreChange)));
  }, [urlScanResult]);

  useEffect(() => {
    if (!cloudScanResult || cloudScanResult.error) return;
    let scoreChange = 0;
    cloudScanResult.misconfigurations.forEach(issue => {
        if (issue.severity === 'Critical') scoreChange += 15;
        if (issue.severity === 'High') scoreChange += 10;
    });
    setOverallRiskScore(prevScore => Math.max(0, Math.min(100, prevScore + scoreChange)));
  }, [cloudScanResult]);

  useEffect(() => {
    if (!aiScanResult || aiScanResult.error) return;
    let scoreChange = 0;
    aiScanResult.anomalies.forEach(issue => {
        if (issue.severity === 'High') scoreChange += 10;
    });
    setOverallRiskScore(prevScore => Math.max(0, Math.min(100, prevScore + scoreChange)));
  }, [aiScanResult]);

  // --- HANDLER FUNCTIONS ---
  const handleUrlScan = async () => {
    if (!urlToScan) return;
    setIsUrlLoading(true);
    setUrlScanResult(null);
    try {
      const response = await axios.post('http://localhost:3001/api/scan/url', { url: urlToScan });
      setUrlScanResult(response.data);
    } catch (error) {
      setUrlScanResult({ error: 'Scan failed' });
    }
    setIsUrlLoading(false);
  };
  
  const handleFileScan = async (file, scanType) => {
    if (!file) return;
    const formData = new FormData();
    let apiUrl = '';

    if (scanType === 'cloud') {
      setIsCloudLoading(true);
      setCloudFileName(file.name);
      setCloudScanResult(null);
      formData.append('configFile', file);
      apiUrl = 'http://localhost:3001/api/scan/cloud-config';
    } else if (scanType === 'ai') {
      setIsAiLoading(true);
      setAiFileName(file.name);
      setAiScanResult(null);
      formData.append('datasetFile', file);
      apiUrl = 'http://localhost:3001/api/scan/ai-dataset';
    }

    try {
      const response = await axios.post(apiUrl, formData);
      if (scanType === 'cloud') setCloudScanResult(response.data);
      if (scanType === 'ai') setAiScanResult(response.data);
    } catch (error) {
      if (scanType === 'cloud') setCloudScanResult({ error: 'Scan failed' });
      if (scanType === 'ai') setAiScanResult({ error: 'Scan failed' });
    } finally {
      if (scanType === 'cloud') setIsCloudLoading(false);
      if (scanType === 'ai') setIsAiLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Security Overview</h1>
          <p>Welcome back, Admin. System status is nominal.</p>
        </header>

        <main className="dashboard-grid">
          <div className="widget large-widget">
            <h2 className="widget-title">Overall Risk Score</h2>
            <div className="risk-score-dial">
              <CircularProgressbar
                value={overallRiskScore}
                text={`${overallRiskScore}`}
                strokeWidth={5}
                styles={buildStyles({
                  textColor: '#e5e5e5',
                  pathColor: `rgb(${overallRiskScore * 2.55}, ${255 - (overallRiskScore * 2.55)}, 0)`,
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
            <p className="widget-description">
              This score represents the current threat level across all monitored assets.
            </p>
          </div>

          <div className="widget">
            <h2 className="widget-title">ThreatEye Scanner</h2>
            <p className="widget-description">Analyze suspicious URLs in real-time.</p>
            <div className="widget-content">
              <input type="text" placeholder="https://example.com" className="widget-input" value={urlToScan} onChange={(e) => setUrlToScan(e.target.value)} />
              <button className="widget-button" onClick={handleUrlScan} disabled={isUrlLoading}>
                {isUrlLoading ? <FaSpinner className="spinner" /> : 'Scan URL'}
              </button>
            </div>
            <ScanResult result={urlScanResult} />
          </div>
          
          <div className="widget">
            <h2 className="widget-title">Cloud Guard</h2>
            <p className="widget-description">Upload a config file to start the scan.</p>
            <div className="widget-content">
              <label className={`widget-button file-button ${isCloudLoading ? 'disabled' : ''}`} htmlFor="cloud-file-input">
                {isCloudLoading ? <FaSpinner className="spinner" /> : (cloudFileName || 'Upload & Scan Config')}
              </label>
              <input id="cloud-file-input" type="file" className="widget-file-input" onChange={(e) => handleFileScan(e.target.files[0], 'cloud')} disabled={isCloudLoading}/>
            </div>
            <ScanResult result={cloudScanResult} fileName={cloudFileName} />
          </div>
          
          <div className="widget">
            <h2 className="widget-title">AI Model Guard</h2>
            <p className="widget-description">Upload a dataset to start the scan.</p>
            <div className="widget-content">
              <label className={`widget-button file-button ${isAiLoading ? 'disabled' : ''}`} htmlFor="ai-file-input">
                {isAiLoading ? <FaSpinner className="spinner" /> : (aiFileName || 'Upload & Scan Dataset')}
              </label>
              <input id="ai-file-input" type="file" accept=".csv" className="widget-file-input" onChange={(e) => handleFileScan(e.target.files[0], 'ai')} disabled={isAiLoading}/>
            </div>
            <ScanResult result={aiScanResult} fileName={aiFileName} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;