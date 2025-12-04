import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    { path: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/levels', label: 'Levels', icon: 'bi-layers' },
    { path: '/categories', label: 'Categories', icon: 'bi-folder' },
    { path: '/admins', label: 'Admins', icon: 'bi-person-badge' },
    { path: '/items', label: 'Kitchen Items', icon: 'bi-box' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`bg-dark text-white position-fixed start-0 top-0 h-100 d-flex flex-column ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`} style={{ zIndex: 1000 }}>
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-between">
          {!collapsed && (
            <h5 className="mb-0 fw-semibold">
              <i className="bi bi-egg-fried me-2"></i>
              Kitchen Management
            </h5>
          )}
          {collapsed && (
            <h5 className="mb-0 text-center w-100">
              <i className="bi bi-egg-fried"></i>
            </h5>
          )}
          <button
            className="btn btn-link text-white p-0 ms-2"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>
      </div>
      <nav className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column px-2 py-3">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className={`nav-link text-white-50 d-flex align-items-center py-2 px-3 rounded ${isActive(item.path) ? 'bg-secondary text-white' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <i className={`bi ${item.icon} ${collapsed ? '' : 'me-2'}`} style={{ minWidth: '20px' }}></i>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

