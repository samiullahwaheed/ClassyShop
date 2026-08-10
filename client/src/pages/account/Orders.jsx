import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const STATUS_COLOR = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-gray-900">My Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon="📦" title="You haven't placed any orders yet" description="Your order history will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/my-account/orders/${order._id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-brand-200"
            >
              <div>
                <p className="font-medium text-gray-800">{order.orderId}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[order.status]}`}>{order.status}</span>
                <span className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
