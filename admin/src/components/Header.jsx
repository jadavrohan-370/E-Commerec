import React from 'react';
import { MdNotifications, MdSearch, MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header glass-header">
      <div className="header-left">
        <div className="search-bar">
          <MdSearch className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-btn">
          <MdNotifications />
          <span className="badge">3</span>
        </button>
        
        <button className="icon-btn" onClick={logout} title="Logout">
          <MdLogout />
        </button>

        <div className="user-profile">
          <img src={user?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Admin" className="avatar" />
          <div className="user-info">
            <h4>{user?.firstName || user?.name || "Admin User"}</h4>
            <p>{user?.isAdmin || user?.role === 'admin' ? "Super Admin" : "User"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
