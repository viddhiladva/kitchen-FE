import React, { useState, useEffect } from 'react';
import { adminService, Admin } from '../../services/adminService';
import SearchBar from '../shared/SearchBar';
import Pagination from '../shared/Pagination';
import AdminForm from './AdminForm';
import Modal from '../shared/Modal';
import Toast from '../shared/Toast';
import TopBar from '../shared/TopBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

const AdminsList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const limit = 10;

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAll(debouncedSearch || '', currentPage, limit);
      setAdmins(response?.data || []);
      setTotalPages(Math.ceil((response?.total || 0) / limit));
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error fetching admins';
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
    fetchAdmins();
  }, [currentPage, debouncedSearch]);

  const handleCreate = () => {
    setEditingAdmin(null);
    setShowModal(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        setDeletingId(id);
        await adminService.delete(id);
        showToast('Admin deleted successfully', 'success');
        fetchAdmins();
      } catch (error: any) {
        console.error('Error deleting admin:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Error deleting admin';
        showToast(errorMessage, 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAdmin(null);
    fetchAdmins();
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
      <TopBar title="Administrators Management" />
      
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Admin
          </button>
        </div>
        <div className="card-body">
          <SearchBar value={search} onChange={setSearch} placeholder="Search admins by name or email..." />
          
          {loading && !isInitialLoad ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : admins?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h5>No admins found</h5>
              <p className="text-muted">
                {search ? 'Try adjusting your search criteria' : 'Get started by adding your first admin'}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins?.map((admin) => (
                      <tr key={admin?.id}>
                        <td>
                          <strong>{admin?.name || 'N/A'}</strong>
                        </td>
                        <td>
                          <span className="text-muted">{admin?.email || 'N/A'}</span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary btn-action"
                            onClick={() => admin && handleEdit(admin)}
                            disabled={deletingId === admin?.id}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => admin?.id && handleDelete(admin.id)}
                            disabled={deletingId === admin?.id}
                          >
                            {deletingId === admin?.id ? (
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
        title={editingAdmin ? 'Edit Admin' : 'Create New Admin'}
      >
        <AdminForm
          admin={editingAdmin}
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

export default AdminsList;

