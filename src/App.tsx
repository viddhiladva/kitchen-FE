import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import LevelsList from './components/Levels/LevelsList';
import CategoriesList from './components/Categories/CategoriesList';
import AdminsList from './components/Admins/AdminsList';
import ItemsList from './components/Items/ItemsList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/levels" element={<LevelsList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/admins" element={<AdminsList />} />
          <Route path="/items" element={<ItemsList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

