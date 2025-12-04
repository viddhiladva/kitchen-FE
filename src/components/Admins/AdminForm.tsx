import React, { useState, useEffect } from 'react';
import { adminService, Admin, AdminCreateDto } from '../../services/adminService';

interface AdminFormProps {
  admin: Admin | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ admin, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<AdminCreateDto>({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      setFormData({ name: admin.name, email: admin.email });
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (admin) {
        await adminService.update(admin.id, formData);
      } else {
        await adminService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Admin name"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="admin@example.com"
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : admin ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;

