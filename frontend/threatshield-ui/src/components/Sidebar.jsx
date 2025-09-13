import React from 'react';
import './Sidebar.css';
// 1. Import NavLink for navigation
import { NavLink } from 'react-router-dom'; 
import { FaShieldAlt, FaTachometerAlt, FaCloud, FaBrain, FaCog, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <FaShieldAlt size={40} className="sidebar-logo" />
        <h1 className="sidebar-title">ThreatShield</h1>
      </div>
      {/* 2. Replace <ul> with NavLink components */}
      <div className="sidebar-menu">
        <NavLink to="/dashboard" className="sidebar-item">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/cloud-guard" className="sidebar-item">
          <FaCloud />
          <span>Cloud Guard</span>
        </NavLink>
        <NavLink to="/ai-guard" className="sidebar-item">
          <FaBrain />
          <span>AI Guard</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </div>
      <div className="sidebar-footer">
        {/* This can be a regular div or a link to the login page */}
        <NavLink to="/login" className="sidebar-item">
          <FaSignOutAlt />
          <span>Logout</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;