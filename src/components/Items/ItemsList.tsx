import React, { useState, useEffect } from 'react';
import { itemService, KitchenItem } from '../../services/itemService';
import SearchBar from '../shared/SearchBar';
import Pagination from '../shared/Pagination';
import ItemForm from './ItemForm';
import Modal from '../shared/Modal';
import Toast from '../shared/Toast';
import TopBar from '../shared/TopBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<KitchenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KitchenItem | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const limit = 10;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAll(debouncedSearch || '', currentPage, limit);
      setItems(response?.data || []);
      setTotalPages(Math.ceil((response?.total || 0) / limit));
    } catch (error: any) {
      console.error('Error fetching items:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error fetching items';
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
    fetchItems();
  }, [currentPage, debouncedSearch]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: KitchenItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setDeletingId(id);
        await itemService.delete(id);
        showToast('Item deleted successfully', 'success');
        fetchItems();
      } catch (error: any) {
        console.error('Error deleting item:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Error deleting item';
        showToast(errorMessage, 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchItems();
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
      <TopBar title="Kitchen Items Management" />
      
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Item
          </button>
        </div>
        <div className="card-body">
          <SearchBar value={search} onChange={setSearch} placeholder="Search items by name..." />
          
          {loading && !isInitialLoad ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : items?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h5>No items found</h5>
              <p className="text-muted">
                {search ? 'Try adjusting your search criteria' : 'Get started by adding your first kitchen item'}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Level</th>
                      <th>Category</th>
                      <th>Admin</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((item) => (
                      <tr key={item?.id}>
                        <td>
                          <strong>{item?.name || 'N/A'}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {item?.level?.name || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {item?.category?.name || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted">
                            {item?.admin?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary btn-action"
                            onClick={() => item && handleEdit(item)}
                            disabled={deletingId === item?.id}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => item?.id && handleDelete(item.id)}
                            disabled={deletingId === item?.id}
                          >
                            {deletingId === item?.id ? (
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
        title={editingItem ? 'Edit Kitchen Item' : 'Create New Kitchen Item'}
        size="lg"
      >
        <ItemForm
          item={editingItem}
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

export default ItemsList;

