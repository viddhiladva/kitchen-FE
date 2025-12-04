import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { levelService } from '../services/levelService';
import { categoryService } from '../services/categoryService';
import { adminService } from '../services/adminService';
import { itemService } from '../services/itemService';
import TopBar from '../components/shared/TopBar';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    levels: 0,
    categories: 0,
    admins: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [levelsRes, categoriesRes, adminsRes, itemsRes] = await Promise.all([
          levelService.getAll('', 1, 1),
          categoryService.getAll('', 1, 1),
          adminService.getAll('', 1, 1),
          itemService.getAll('', 1, 1),
        ]);

        setStats({
          levels: levelsRes?.total || 0,
          categories: categoriesRes?.total || 0,
          admins: adminsRes?.total || 0,
          items: itemsRes?.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <TopBar title="Dashboard Overview" />
      
      <div className="page-content">
        <div className="container-fluid">
          <div className="row g-4">
          <div className="col-md-3">
            <div className="card stats-card text-center">
              <div className="card-body">
                <i className="bi bi-layers fs-1 text-dark mb-2 d-block"></i>
                <h2 className="display-3 text-dark">{stats?.levels || 0}</h2>
                <h5 className="card-title text-muted">Levels</h5>
                <Link to="/levels" className="btn btn-dark">
                  <i className="bi bi-layers me-2"></i>
                  Manage Levels
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card stats-card text-center">
              <div className="card-body">
                <i className="bi bi-folder fs-1 text-dark mb-2 d-block"></i>
                <h2 className="display-3 text-dark">{stats?.categories || 0}</h2>
                <h5 className="card-title text-muted">Categories</h5>
                <Link to="/categories" className="btn btn-dark">
                  <i className="bi bi-folder me-2"></i>
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card stats-card text-center">
              <div className="card-body">
                <i className="bi bi-person-badge fs-1 text-dark mb-2 d-block"></i>
                <h2 className="display-3 text-dark">{stats?.admins || 0}</h2>
                <h5 className="card-title text-muted">Admins</h5>
                <Link to="/admins" className="btn btn-dark">
                  <i className="bi bi-person-badge me-2"></i>
                  Manage Admins
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card stats-card text-center">
              <div className="card-body">
                <i className="bi bi-box fs-1 text-dark mb-2 d-block"></i>
                <h2 className="display-3 text-dark">{stats?.items || 0}</h2>
                <h5 className="card-title text-muted">Kitchen Items</h5>
                <Link to="/items" className="btn btn-dark">
                  <i className="bi bi-box me-2"></i>
                  Manage Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;

