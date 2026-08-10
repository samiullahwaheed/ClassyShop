import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { useGetProductsQuery, useDeleteProductMutation } from '../../features/products/productsApi.js';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import SearchBar from '../../components/ui/SearchBar.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { FormSelect } from '../../components/ui/FormField.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });
  const { data, isLoading } = useGetProductsQuery({ page, limit, search, category: category || undefined });
  const [deleteProduct] = useDeleteProductMutation();
  const showToast = useToast();

  async function confirmDelete() {
    try {
      await deleteProduct(pendingDelete._id).unwrap();
      showToast('Product deleted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setPendingDelete(null);
    }
  }

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.images?.[0]?.url} alt="" className="h-10 w-10 rounded-md bg-gray-100 object-cover" />
          <div>
            <p className="max-w-[220px] truncate font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{row.brand}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => row.category?.name },
    { key: 'subCategory', header: 'Sub Category', render: (row) => row.subCategory?.name || '—' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => (
        <div>
          {row.oldPrice ? <p className="text-xs text-gray-400 line-through">₹{row.oldPrice.toFixed(2)}</p> : null}
          <p className="font-semibold text-blue-600">₹{row.price.toFixed(2)}</p>
        </div>
      ),
    },
    { key: 'sales', header: 'Sales', render: (row) => `${row.sales || 0} sale` },
    { key: 'stock', header: 'Stock', render: (row) => <span className="text-blue-600">{row.stock}</span> },
    { key: 'rating', header: 'Rating', render: (row) => <StarRating value={row.rating?.average} /> },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-3 text-gray-400">
          <Link to={`/products/edit/${row._id}`} className="hover:text-gray-700">
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        <Link to="/products/upload" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">
          ADD PRODUCT
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <FormSelect label="Category By" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </FormSelect>
        <FormSelect label="Sub Category By" disabled>
          <option>All</option>
        </FormSelect>
        <FormSelect label="Third Level Sub Category By" disabled>
          <option>All</option>
        </FormSelect>
        <div className="flex flex-col justify-end">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
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
        title="Delete product?"
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
