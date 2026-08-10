import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAddressesQuery, useAddAddressMutation } from '../features/user/userApi.js';
import { useCreateOrderMutation } from '../features/orders/ordersApi.js';
import { selectCartItems, selectCartSubtotal, clearCart } from '../features/cart/cartSlice.js';
import AddressFormPanel from '../components/account/AddressFormPanel.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useToast } from '../hooks/useToast.js';

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const { data: addresses = [] } = useGetAddressesQuery();
  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [createOrder, { isLoading: placingOrder }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?._id || '');
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || addresses[0];

  async function handleAddAddress(form) {
    try {
      const result = await addAddress(form).unwrap();
      const newAddress = result.data.addresses[result.data.addresses.length - 1];
      setSelectedAddressId(newAddress._id);
      setPanelOpen(false);
      showToast('Address saved', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save address', 'error');
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) return showToast('Please add a delivery address', 'error');
    try {
      const { deliveryAddress: _omit, _id, createdAt, updatedAt, isDefault, ...address } = selectedAddress;
      const order = await createOrder({
        items: items.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          size: i.size,
          weight: i.weight,
        })),
        deliveryAddress: address,
      }).unwrap();
      dispatch(clearCart());
      navigate('/checkout/success', { state: { orderId: order.data.order.orderId } });
    } catch (err) {
      showToast(err?.data?.message || 'Failed to place order', 'error');
    }
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:px-10">
      <div className="flex-1 rounded-xl border border-gray-100 p-6">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">Select Delivery Address</h1>

        {addresses.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No Addresses found in your account!"
            description="Add a delivery address."
            action={
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="mt-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                ADD ADDRESS
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  selectedAddressId === addr._id ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                  className="mt-1 accent-brand-500"
                />
                <div className="text-sm text-gray-700">
                  <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{addr.addressType}</span>
                  {addr.addressLine1}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                  <p className="mt-1 text-xs text-gray-400">{addr.countryCode} {addr.phone}</p>
                </div>
              </label>
            ))}
            <button type="button" onClick={() => setPanelOpen(true)} className="self-start text-sm font-medium text-brand-500 hover:underline">
              + Add another address
            </button>
          </div>
        )}
      </div>

      <div className="w-full rounded-xl border border-gray-100 p-6 lg:w-96 lg:shrink-0">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Order</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId + (item.size || '')} className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <img src={item.image} alt="" className="h-12 w-12 rounded-md bg-gray-50 object-cover" />
              <div className="flex-1 text-sm">
                <p className="line-clamp-1 font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">Qty : {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{(subtotal + shipping).toFixed(2)}</span>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">Payment Method: Cash on Delivery</p>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placingOrder || !selectedAddress}
          className="mt-4 w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          PLACE ORDER
        </button>
      </div>

      <AddressFormPanel open={panelOpen} onClose={() => setPanelOpen(false)} onSubmit={handleAddAddress} isSaving={addingAddress} />
    </div>
  );
}
