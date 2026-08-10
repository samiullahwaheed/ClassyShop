import { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/usersApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import SearchBar from '../../components/ui/SearchBar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';

function maskEmail(email = '') {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  return `${name.slice(0, 4)}***@${domain}`;
}

export default function UsersList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data, isLoading } = useGetUsersQuery({ page, limit, search });
  const [deleteUser] = useDeleteUserMutation();
  const showToast = useToast();

  async function confirmDelete() {
    try {
      await deleteUser(pendingDelete._id).unwrap();
      showToast('User deleted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setPendingDelete(null);
    }
  }

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar?.url ? (
            <img src={row.avatar.url} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-white">
              {row.name?.[0]?.toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{maskEmail(row.email)}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'User Phone No', render: (row) => row.phone || 'NONE' },
    {
      key: 'emailVerified',
      header: 'Email Verify',
      render: (row) => <Badge variant={row.emailVerified ? 'success' : 'warning'}>{row.emailVerified ? 'Verified' : 'Unverified'}</Badge>,
    },
    { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toISOString().slice(0, 10) },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <button
          type="button"
          onClick={() => setPendingDelete(row)}
          className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
        >
          DELETE
        </button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Users List</h1>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      <DataTable columns={columns} rows={data?.data || []} isLoading={isLoading} selectable />

      <Pagination
        page={page}
        limit={limit}
        total={data?.pagination?.total || 0}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete user?"
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
        <p className="text-sm text-gray-600">This will permanently remove "{pendingDelete?.name}".</p>
      </Modal>
    </div>
  );
}
