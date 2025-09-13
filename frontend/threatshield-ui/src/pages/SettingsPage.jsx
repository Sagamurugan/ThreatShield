import React from 'react';
import Sidebar from '../components/Sidebar';
import './ContentPage.css'; // Also uses the shared CSS

function SettingsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>Settings</h1>
          <p>Manage your application settings and preferences.</p>
        </header>

        <main className="content-card">
          <div className="settings-section">
            <h3 className="settings-title">Profile</h3>
            <div className="settings-item">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" className="settings-input" defaultValue="Admin" />
            </div>
            <div className="settings-item">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="settings-input" defaultValue="admin@threatshield.io" />
            </div>
            <button className="scan-button">Update Profile</button>
          </div>

          <div className="settings-section">
            <h3 className="settings-title">Notifications</h3>
            <div className="settings-item-toggle">
              <span>Email Alerts for Critical Threats</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-item-toggle">
              <span>Telegram Alerts</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;