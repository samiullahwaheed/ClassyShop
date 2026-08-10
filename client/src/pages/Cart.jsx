import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuX } from 'react-icons/lu';
import { selectCartItems, selectCartSubtotal, updateQuantity, removeItem, lineKey } from '../features/cart/cartSlice.js';
import QtyStepper from '../components/ui/QtyStepper.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function Cart() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;

  if (items.length === 0) {
    return (
      <div className="px-6 py-16 lg:px-10">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={
            <Link to="/products" className="mt-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:px-10">
      <div className="flex-1 rounded-xl border border-gray-100 p-6">
        <h1 className="text-lg font-semibold text-gray-900">Your Cart</h1>
        <p className="mb-4 text-sm text-gray-500">
          There are <span className="font-semibold text-brand-500">{items.length}</span> products in your cart
        </p>

        <div className="flex flex-col divide-y divide-gray-100">
          {items.map((item) => {
            const key = lineKey(item);
            return (
              <div key={key} className="flex items-center gap-4 py-4">
                <img src={item.image} alt="" className="h-20 w-20 rounded-lg bg-gray-50 object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    {item.size && (
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Size: {item.size}</span>
                    )}
                    <QtyStepper value={item.quantity} onChange={(q) => dispatch(updateQuantity({ key, quantity: q }))} max={item.stock} />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                    {item.oldPrice > item.price && <span className="text-gray-400 line-through">₹{item.oldPrice.toFixed(2)}</span>}
                  </div>
                </div>
                <button type="button" onClick={() => dispatch(removeItem(key))} className="text-gray-400 hover:text-red-600">
                  <LuX size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full rounded-xl border border-gray-100 p-6 lg:w-80 lg:shrink-0">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Cart Totals</h2>
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span>Subtotal</span>
            <span className="font-semibold text-brand-500">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{(subtotal + shipping).toFixed(2)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          CHECKOUT
        </Link>
      </div>
    </div>
  );
}
