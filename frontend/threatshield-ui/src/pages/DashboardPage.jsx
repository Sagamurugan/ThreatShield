import React from 'react';
import './DashboardPage.css';
import Sidebar from '../components/Sidebar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashboardPage() {
  const overallRiskScore = 78;

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
                  pathColor: `rgba(255, 0, 0, ${overallRiskScore / 100})`,
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                })}
              />
            </div>
            <p className="widget-description">This score represents the current threat level across all monitored assets.</p>
          </div>

          <div className="widget">
            <h2 className="widget-title">ThreatEye Scanner</h2>
            <p className="widget-description">Analyze suspicious URLs in real-time.</p>
            <div className="widget-content">
              <input type="text" placeholder="https://example.com" className="widget-input" />
              <button className="widget-button">Scan URL</button>
            </div>
          </div>
          
          <div className="widget">
            <h2 className="widget-title">Cloud Guard</h2>
            <p className="widget-description">Scan cloud configuration files.</p>
            <div className="widget-content">
              <button className="widget-button file-button">
                <span>Upload Config File</span>
                <input type="file" className="widget-file-input" />
              </button>
            </div>
          </div>

          {/* --- FIX: ADDED THIS WIDGET BACK --- */}
          <div className="widget">
            <h2 className="widget-title">AI Model Guard</h2>
            <p className="widget-description">Scan AI datasets for anomalies.</p>
            <div className="widget-content">
              <button className="widget-button file-button">
                <span>Upload Dataset (.csv)</span>
                <input type="file" className="widget-file-input" />
              </button>
            </div>
          </div>
          {/* ------------------------------------ */}
          
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;