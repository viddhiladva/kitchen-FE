import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'Dashboard', path: '/' }];

    if (path === '/') {
      return [{ label: 'Dashboard', path: '/' }];
    }

    const pathMap: { [key: string]: string } = {
      '/levels': 'Levels',
      '/categories': 'Categories',
      '/admins': 'Admins',
      '/items': 'Kitchen Items',
    };

    const currentPath = pathMap[path];
    if (currentPath) {
      crumbs.push({ label: currentPath, path });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-white border-bottom shadow-sm sticky-top" style={{ zIndex: 100 }}>
      <div className="container-fluid px-4 py-3">
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb mb-0">
            {breadcrumbs.map((crumb, index) => (
              <li
                key={crumb.path}
                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
              >
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-muted">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-decoration-none">{crumb.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="h3 mb-0 fw-semibold">{title}</h1>
      </div>
    </div>
  );
};

export default TopBar;

