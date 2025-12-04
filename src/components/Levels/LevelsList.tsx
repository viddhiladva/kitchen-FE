import React, { useState, useEffect } from 'react';
import { levelService, Level } from '../../services/levelService';
import SearchBar from '../shared/SearchBar';
import Pagination from '../shared/Pagination';
import LevelForm from './LevelForm';
import Modal from '../shared/Modal';
import Toast from '../shared/Toast';
import TopBar from '../shared/TopBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

const LevelsList: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const limit = 10;

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await levelService.getAll(debouncedSearch || '', currentPage, limit);
      setLevels(response?.data || []);
      setTotalPages(Math.ceil((response?.total || 0) / limit));
    } catch (error: any) {
      console.error('Error fetching levels:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error fetching levels';
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
    fetchLevels();
  }, [currentPage, debouncedSearch]);

  const handleCreate = () => {
    setEditingLevel(null);
    setShowModal(true);
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        setDeletingId(id);
        await levelService.delete(id);
        showToast('Level deleted successfully', 'success');
        fetchLevels();
      } catch (error: any) {
        console.error('Error deleting level:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Error deleting level';
        showToast(errorMessage, 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLevel(null);
    fetchLevels();
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
      <TopBar title="Levels Management" />
      
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button className="btn btn-primary" onClick={handleCreate}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Level
            </button>
        </div>
        <div className="card-body">
          <SearchBar value={search} onChange={setSearch} placeholder="Search levels..." />
          
          {loading && !isInitialLoad ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : levels?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h5>No levels found</h5>
              <p className="text-muted">
                {search ? 'Try adjusting your search criteria' : 'Get started by adding your first level'}
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
                    {levels?.map((level) => (
                      <tr key={level?.id}>
                        <td>
                          <span className="badge bg-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            {level?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary btn-action"
                            onClick={() => level && handleEdit(level)}
                            disabled={deletingId === level?.id}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => level?.id && handleDelete(level.id)}
                            disabled={deletingId === level?.id}
                          >
                            {deletingId === level?.id ? (
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
        title={editingLevel ? 'Edit Level' : 'Create New Level'}
      >
        <LevelForm
          level={editingLevel}
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

export default LevelsList;

