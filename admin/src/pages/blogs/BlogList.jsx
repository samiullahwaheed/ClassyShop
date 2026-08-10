import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { useGetBlogsQuery, useDeleteBlogsMutation } from '../../features/content/contentApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function BlogList() {
  const { data: items = [], isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogsMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const showToast = useToast();

  async function confirmDelete() {
    try {
      await deleteBlog(pendingDelete._id).unwrap();
      showToast('Blog post deleted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setPendingDelete(null);
    }
  }

  const columns = [
    { key: 'image', header: 'Image', render: (row) => <img src={row.image?.url} alt="" className="h-12 w-16 rounded-md bg-gray-100 object-cover" /> },
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-3 text-gray-400">
          <Link to={`/blogs/edit/${row._id}`} className="hover:text-gray-700">
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
        <h1 className="text-lg font-semibold text-gray-900">Blogs List</h1>
        <Link to="/blogs/add" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">
          ADD BLOG
        </Link>
      </div>

      <DataTable columns={columns} rows={items} isLoading={isLoading} />

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete blog post?"
        footer={
          <>
            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">This will permanently remove "{pendingDelete?.title}".</p>
      </Modal>
    </div>
  );
}
