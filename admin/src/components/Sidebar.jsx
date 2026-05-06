import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdSpaceDashboard, MdAttachMoney, MdShoppingCart, MdInventory, MdSettings } from 'react-icons/md';
import gsap from 'gsap';
import './Sidebar.css';

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <MdSpaceDashboard /> },
    { name: 'Sales', path: '/sales', icon: <MdAttachMoney /> },
    { name: 'Purchases', path: '/purchases', icon: <MdShoppingCart /> },
    { name: 'Stock', path: '/stock', icon: <MdInventory /> },
  ];

  return (
    <aside className="sidebar glass-panel" ref={sidebarRef}>
      <div className="sidebar-logo">
        <div className="logo-icon">E</div>
        <h2>Admin<span>Pro</span></h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
                {location.pathname === item.path && (
                  <div className="active-indicator" layoutid="activeIndicator"></div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link settings-btn">
          <span className="nav-icon"><MdSettings /></span>
          <span className="nav-text">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
