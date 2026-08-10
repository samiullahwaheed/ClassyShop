import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { useGetBannersQuery, useDeleteBannersMutation } from '../../features/content/contentApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function BannerList() {
  const { data: items = [], isLoading } = useGetBannersQuery();
  const [deleteBanner] = useDeleteBannersMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const showToast = useToast();

  async function confirmDelete() {
    try {
      await deleteBanner(pendingDelete._id).unwrap();
      showToast('Banner deleted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete banner', 'error');
    } finally {
      setPendingDelete(null);
    }
  }

  const columns = [
    { key: 'image', header: 'Image', render: (row) => <img src={row.image?.url} alt="" className="h-16 w-28 rounded-lg bg-gray-100 object-cover" /> },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-3 text-gray-400">
          <Link to={`/banners/edit/${row._id}`} className="hover:text-gray-700">
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
        <h1 className="text-lg font-semibold text-gray-900">Banners List</h1>
        <Link to="/banners/add" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">
          ADD BANNER
        </Link>
      </div>

      <DataTable columns={columns} rows={items} isLoading={isLoading} />
      <Pagination page={1} limit={10} total={items.length} totalPages={1} onPageChange={() => {}} onLimitChange={() => {}} />

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete banner?"
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
        <p className="text-sm text-gray-600">This will permanently remove this banner.</p>
      </Modal>
    </div>
  );
}
