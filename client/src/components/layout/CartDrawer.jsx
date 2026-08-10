import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import SlidePanel from '../ui/SlidePanel.jsx';
import { setCartDrawerOpen } from '../../features/ui/uiSlice.js';
import { selectCartItems, selectCartSubtotal, removeItem, lineKey } from '../../features/cart/cartSlice.js';
import EmptyState from '../ui/EmptyState.jsx';

export default function CartDrawer() {
  const open = useSelector((state) => state.ui.cartDrawerOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();

  function close() {
    dispatch(setCartDrawerOpen(false));
  }

  return (
    <SlidePanel open={open} onClose={close} title={`Shopping Cart (${items.length})`}>
      {items.length === 0 ? (
        <EmptyState icon="🛒" title="Your cart is empty" description="Add products to see them here." />
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {items.map((item) => (
              <div key={lineKey(item)} className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <img src={item.image} alt="" className="h-16 w-16 rounded-lg bg-gray-100 object-cover" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty : {item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeItem(lineKey(item)))}
                  className="text-gray-400 hover:text-red-600"
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{items.length} item{items.length > 1 ? 's' : ''}</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total (tax excl.)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={close}
                className="flex-1 rounded-lg bg-brand-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-600"
              >
                VIEW CART
              </Link>
              <Link
                to="/checkout"
                onClick={close}
                className="flex-1 rounded-lg border border-brand-500 py-2.5 text-center text-sm font-semibold text-brand-500 hover:bg-brand-50"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        </>
      )}
    </SlidePanel>
  );
}
