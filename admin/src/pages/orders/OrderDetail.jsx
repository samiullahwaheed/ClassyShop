import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi.js';
import { FormSelect } from '../../components/ui/FormField.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderQuery(id);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const showToast = useToast();

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  async function handleStatusChange(e) {
    try {
      await updateStatus({ id, status: e.target.value }).unwrap();
      showToast('Order status updated', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update status', 'error');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/orders" className="text-gray-400 hover:text-gray-700">
          <LuArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Order {order.orderId}</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Items</h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0">
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg bg-gray-100 object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    Qty: {item.quantity} {item.size && `· Size: ${item.size}`}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-1.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900">Delivery Address</h2>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.addressLine1}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
              <br />
              {order.deliveryAddress.country}
              <br />
              Phone: {order.deliveryAddress.phone}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900">Order Status</h2>
            <FormSelect value={order.status} onChange={handleStatusChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </FormSelect>
            <p className="mt-3 text-xs text-gray-400">Payment: {order.paymentMethod} · {order.paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
