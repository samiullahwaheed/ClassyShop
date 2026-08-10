import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '../../features/categories/categoriesApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function CategoryList() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ level: 0 });
  const [deleteCategory] = useDeleteCategoryMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const showToast = useToast();

  async function confirmDelete() {
    try {
      await deleteCategory(pendingDelete._id).unwrap();
      showToast('Category deleted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete category', 'error');
    } finally {
      setPendingDelete(null);
    }
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (row) => (
        <img
          src={row.image?.url}
          alt=""
          className="h-10 w-10 rounded-md bg-gray-100 object-cover"
        />
      ),
    },
    { key: 'name', header: 'Category Name' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-3 text-gray-400">
          <Link to={`/categories/edit/${row._id}`} className="hover:text-gray-700">
            <LuPencil size={16} />
          </Link>
          <button type="button" onClick={() => setPendingDelete(row)} className="hover:text-red-600">
            <LuTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Category List</h1>
        <Link
          to="/categories/add"
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600"
        >
          ADD CATEGORY
        </Link>
      </div>

      <DataTable columns={columns} rows={categories} isLoading={isLoading} />

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete category?"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This will permanently remove "{pendingDelete?.name}". This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
