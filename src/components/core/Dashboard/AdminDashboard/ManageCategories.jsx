import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllCategories, createCategory, deleteCategory } from '../../../../services/operations/adminAPI';

export default function ManageCategories() {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories(token);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newDescription.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createCategory({ name: newCategory, description: newDescription }, token);
      setSuccess('Category created successfully');
      setNewCategory('');
      setNewDescription('');
      fetchCategories();
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteCategory(categoryId, token);
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-admin-bg min-h-screen w-full p-8">
      <h1 className="text-2xl font-bold text-admin-primary mb-6">Manage Categories</h1>
      <form onSubmit={handleCreateCategory} className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-admin-border bg-admin-card text-admin-text focus:outline-none focus:border-admin-primary"
        />
        <input
          type="text"
          placeholder="Category description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-admin-border bg-admin-card text-admin-text focus:outline-none focus:border-admin-primary"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-admin-primary text-admin-white font-semibold hover:bg-admin-primaryDark transition-colors"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
      {error && <div className="mb-4 text-admin-danger">{error}</div>}
      {success && <div className="mb-4 text-admin-success">{success}</div>}
      <div className="bg-admin-card rounded-lg p-4 border border-admin-border">
        <h2 className="text-lg font-semibold text-admin-primary mb-4">Existing Categories</h2>
        <ul className="space-y-2">
          {categories.length === 0 && <li className="text-admin-textMuted">No categories found.</li>}
          {categories.map((cat) => (
            <li key={cat._id} className="flex items-center justify-between p-2 rounded bg-admin-secondaryDark border border-admin-border">
              <span className="text-admin-accent">{cat.name}</span>
              <button
                className="px-3 py-1 rounded bg-admin-danger/10 text-admin-danger hover:bg-admin-danger/20 transition-colors text-xs font-semibold"
                onClick={() => handleDeleteCategory(cat._id)}
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 