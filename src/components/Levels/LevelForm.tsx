import React, { useState, useEffect } from 'react';
import { levelService, Level, LevelCreateDto } from '../../services/levelService';

interface LevelFormProps {
  level: Level | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LevelForm: React.FC<LevelFormProps> = ({ level, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<LevelCreateDto>({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (level) {
      setFormData({ name: level.name });
    }
  }, [level]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (level) {
        await levelService.update(level.id, formData);
      } else {
        await levelService.create(formData);
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
          placeholder="e.g., Easy, Medium, Hard"
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : level ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default LevelForm;

