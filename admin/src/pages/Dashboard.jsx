import { useSelector } from 'react-redux';
import { LuUsers, LuGift, LuTag, LuLayoutGrid, LuPlus, LuPencil } from 'react-icons/lu';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice.js';
import { useGetStatsQuery, useGetSalesChartQuery } from '../features/dashboard/dashboardApi.js';
import { useGetProductsQuery } from '../features/products/productsApi.js';
import { useGetOrdersQuery } from '../features/orders/ordersApi.js';
import StatCard from '../components/ui/StatCard.jsx';
import StarRating from '../components/ui/StarRating.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetStatsQuery();
  const { data: chart } = useGetSalesChartQuery();
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: 5 });
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: 5 });

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-blue-50 p-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome,</h1>
          <p className="text-2xl font-bold text-blue-600">{user?.name}</p>
          <p className="mt-2 text-sm text-gray-600">Here's What happening on your store today. See the statistics at once.</p>
          <Link
            to="/products/upload"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <LuPlus size={16} /> Add Product
          </Link>
        </div>
        <div className="text-6xl">🛍️</div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={LuUsers} label="Total Users" value={stats?.totalUsers ?? '—'} color="green" />
        <StatCard icon={LuGift} label="Total Orders" value={stats?.totalOrders ?? '—'} color="blue" />
        <StatCard icon={LuTag} label="Total Products" value={stats?.totalProducts ?? '—'} color="purple" />
        <StatCard icon={LuLayoutGrid} label="Total Category" value={stats?.totalCategories ?? '—'} color="pink" />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <Link to="/products/upload" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
            ADD PRODUCT
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Rating</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Spinner className="mx-auto" />
                  </td>
                </tr>
              ) : (
                productsData?.data?.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 last:border-0">
                    <td className="flex items-center gap-3 px-3 py-3">
                      <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">{p.category?.name}</td>
                    <td className="px-3 py-3">
                      {p.oldPrice && <span className="mr-1 text-gray-400 line-through">₹{p.oldPrice}</span>}
                      <span className="font-semibold text-blue-600">₹{p.price}</span>
                    </td>
                    <td className="px-3 py-3 text-blue-600">{p.stock}</td>
                    <td className="px-3 py-3">
                      <StarRating value={p.rating?.average} />
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/products/edit/${p._id}`} className="text-gray-400 hover:text-gray-700">
                        <LuPencil size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-800 text-xs font-semibold uppercase text-white">
              <tr>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Payment ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Phone Number</th>
                <th className="px-3 py-3">Address</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 text-slate-100">
              {ordersLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <Spinner className="mx-auto" />
                  </td>
                </tr>
              ) : (
                ordersData?.data?.map((o) => (
                  <tr key={o._id} className="border-b border-slate-700 last:border-0">
                    <td className="px-3 py-3">
                      <Link to={`/orders/${o._id}`} className="text-blue-400">
                        {o.orderId}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-blue-400">CASH ON DELIVERY</td>
                    <td className="px-3 py-3">{o.deliveryAddress?.addressLine1 ? o.user?.name : o.user?.name}</td>
                    <td className="px-3 py-3">{o.deliveryAddress?.phone}</td>
                    <td className="px-3 py-3">
                      {o.deliveryAddress?.addressLine1}, {o.deliveryAddress?.city}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Total Users & Total Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart?.series || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="#22c55e" name="Total Sales" />
            <Bar dataKey="totalUsers" fill="#3b82f6" name="Total Users" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
