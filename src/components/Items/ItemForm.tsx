import React, { useState, useEffect } from 'react';
import { itemService, KitchenItem, ItemCreateDto } from '../../services/itemService';
import { levelService, Level } from '../../services/levelService';
import { categoryService, Category } from '../../services/categoryService';
import { adminService, Admin } from '../../services/adminService';

interface ItemFormProps {
  item: KitchenItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ItemCreateDto>({
    name: '',
    levelId: 0,
    categoryId: 0,
    adminId: 0,
  });
  const [levels, setLevels] = useState<Level[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [levelsRes, categoriesRes, adminsRes] = await Promise.all([
          levelService.getAll(),
          categoryService.getAll(),
          adminService.getAll(),
        ]);
        setLevels(levelsRes.data);
        setCategories(categoriesRes.data);
        setAdmins(adminsRes.data);
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        levelId: item.level.id,
        categoryId: item.category.id,
        adminId: item.admin.id,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.levelId || !formData.categoryId || !formData.adminId) {
      setError('Please select Level, Category, and Admin');
      return;
    }

    setLoading(true);

    try {
      if (item) {
        await itemService.update(item.id, formData);
      } else {
        await itemService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Item Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Knife, Tomato"
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="levelId" className="form-label">
            Level <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="levelId"
            value={formData.levelId}
            onChange={(e) => setFormData({ ...formData, levelId: Number(e.target.value) })}
            required
          >
            <option value={0}>Select Level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="categoryId" className="form-label">
            Category <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            required
          >
            <option value={0}>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="adminId" className="form-label">
            Admin <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="adminId"
            value={formData.adminId}
            onChange={(e) => setFormData({ ...formData, adminId: Number(e.target.value) })}
            required
          >
            <option value={0}>Select Admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;

