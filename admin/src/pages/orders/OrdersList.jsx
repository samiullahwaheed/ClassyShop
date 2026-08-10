import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../features/orders/ordersApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import SearchBar from '../../components/ui/SearchBar.jsx';
import Badge from '../../components/ui/Badge.jsx';

const STATUS_VARIANT = {
  Pending: 'warning',
  Confirmed: 'neutral',
  Shipped: 'neutral',
  Delivered: 'success',
  Cancelled: 'danger',
};

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetOrdersQuery({ page, limit, search });

  const columns = [
    { key: 'orderId', header: 'Order ID', render: (row) => <Link to={`/orders/${row._id}`} className="text-blue-600">{row.orderId}</Link> },
    { key: 'name', header: 'Name', render: (row) => row.user?.name },
    { key: 'phone', header: 'Phone Number', render: (row) => row.deliveryAddress?.phone },
    { key: 'address', header: 'Address', render: (row) => `${row.deliveryAddress?.addressLine1}, ${row.deliveryAddress?.city}` },
    { key: 'total', header: 'Total', render: (row) => `₹${row.total?.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge> },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Orders</h1>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      <DataTable columns={columns} rows={data?.data || []} isLoading={isLoading} />

      <Pagination
        page={page}
        limit={limit}
        total={data?.pagination?.total || 0}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}
