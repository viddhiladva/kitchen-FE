import React, { useState, useEffect } from 'react';
import { categoryService, Category } from '../../services/categoryService';
import SearchBar from '../shared/SearchBar';
import Pagination from '../shared/Pagination';
import CategoryForm from './CategoryForm';
import Modal from '../shared/Modal';
import Toast from '../shared/Toast';
import TopBar from '../shared/TopBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const limit = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll(debouncedSearch || '', currentPage, limit);
      setCategories(response?.data || []);
      setTotalPages(Math.ceil((response?.total || 0) / limit));
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error fetching categories';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, debouncedSearch]);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeletingId(id);
        await categoryService.delete(id);
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      } catch (error: any) {
        console.error('Error deleting category:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Error deleting category';
        showToast(errorMessage, 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
  };

  if (loading && isInitialLoad) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <TopBar title="Categories Management" />
      
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Category
          </button>
        </div>
        <div className="card-body">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
          
          {loading && !isInitialLoad ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏷️</div>
              <h5>No categories found</h5>
              <p className="text-muted">
                {search ? 'Try adjusting your search criteria' : 'Get started by adding your first category'}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((category) => (
                      <tr key={category?.id}>
                        <td>
                          <span className="badge bg-success" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            {category?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary btn-action"
                            onClick={() => category && handleEdit(category)}
                            disabled={deletingId === category?.id}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => category?.id && handleDelete(category.id)}
                            disabled={deletingId === category?.id}
                          >
                            {deletingId === category?.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <CategoryForm
          category={editingCategory}
          onSuccess={handleModalClose}
          onCancel={handleModalClose}
        />
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
      </div>
    </div>
  );
};

export default CategoriesList;

