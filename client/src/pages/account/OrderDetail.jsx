import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import { useGetOrderQuery } from '../../features/orders/ordersApi.js';
import Spinner from '../../components/ui/Spinner.jsx';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useGetOrderQuery(orderId);

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/my-account/orders" className="text-gray-400 hover:text-gray-700">
          <LuArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Order {order.orderId}</h1>
      </div>

      <div className="flex flex-col gap-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <img src={item.image} alt="" className="h-16 w-16 rounded-lg bg-gray-100 object-cover" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size && `· Size: ${item.size}`}</p>
            </div>
            <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Delivery Address</h2>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
            {order.deliveryAddress.pincode}, {order.deliveryAddress.country}
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Order Summary</h2>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">Status: {order.status} · Payment: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
