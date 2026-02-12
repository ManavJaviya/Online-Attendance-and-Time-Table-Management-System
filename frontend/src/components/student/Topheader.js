import React, { useState } from 'react';
import './Topheader.css';

const TopHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="student-top-header">
      <button className="sidebar-trigger">
        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="search-container">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="Search subjects, schedule..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="notification-badge">2</span>
        </button>
        
        <div className="divider"></div>
        
        <div className="user-profile">
          <div className="user-info">
            <p className="user-name">John Doe</p>
            <p className="user-role">CS-2021-045</p>
          </div>
          <div className="user-avatar">
            <span>JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;