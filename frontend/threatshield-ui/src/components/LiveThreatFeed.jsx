import React, { useState, useEffect } from 'react';
import './LiveThreatFeed.css';
import { FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';

const mockThreats = [
  { type: 'Malware', severity: 'High', detail: 'Trojan.GenericKD.315 detected on host 192.168.1.102' },
  { type: 'Phishing', severity: 'Critical', detail: 'Suspicious login attempt from IP 203.0.113.45' },
  { type: 'DDoS', severity: 'High', detail: 'Unusual traffic spike detected from network segment 10.0.0.0/8' },
  { type: 'System', severity: 'Safe', detail: 'Security patch KB5034122 successfully applied to server SRV-01' },
];

function LiveThreatFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = mockThreats[Math.floor(Math.random() * mockThreats.length)];
      setEvents(prevEvents => [{ ...newEvent, id: Date.now(), time: new Date() }, ...prevEvents].slice(0, 20));
    }, 3000); // Add a new event every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityClass = (severity) => {
    if (severity === 'Critical') return 'critical';
    if (severity === 'High') return 'high';
    return 'safe';
  };

  return (
    <div className="threat-feed-widget">
      <h3 className="widget-title">Live Threat Feed</h3>
      <ul className="threat-feed-list">
        {events.map(event => (
          <li key={event.id} className="threat-item">
            <span className={`severity-icon ${getSeverityClass(event.severity)}`}>
              {event.severity === 'Safe' ? <FaShieldCheck /> : <FaExclamationTriangle />}
            </span>
            <div className="threat-details">
              <p className="threat-message">{event.detail}</p>
              <span className="threat-timestamp">{event.time.toLocaleTimeString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiveThreatFeed;