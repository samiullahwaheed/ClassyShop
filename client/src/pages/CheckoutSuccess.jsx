import { Link, useLocation } from 'react-router-dom';
import { LuCircleCheck } from 'react-icons/lu';

export default function CheckoutSuccess() {
  const { state } = useLocation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <LuCircleCheck size={64} className="text-green-500" />
      <h1 className="text-2xl font-bold text-gray-900">Order placed successfully!</h1>
      {state?.orderId && <p className="text-gray-600">Your order ID is <span className="font-semibold">{state.orderId}</span></p>}
      <p className="max-w-md text-sm text-gray-500">
        Thank you for shopping with us. You'll receive updates on your order status via your account.
      </p>
      <div className="mt-4 flex gap-3">
        <Link to="/my-account/orders" className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          View My Orders
        </Link>
        <Link to="/" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
