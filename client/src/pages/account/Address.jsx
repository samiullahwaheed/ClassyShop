import { useState } from 'react';
import { LuPencil, LuTrash2, LuPlus } from 'react-icons/lu';
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '../../features/user/userApi.js';
import AddressFormPanel from '../../components/account/AddressFormPanel.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function Address() {
  const { data: addresses = [] } = useGetAddressesQuery();
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const showToast = useToast();

  async function handleSubmit(form) {
    try {
      if (editing) {
        await updateAddress({ addressId: editing._id, ...form }).unwrap();
        showToast('Address updated', 'success');
      } else {
        await addAddress(form).unwrap();
        showToast('Address added', 'success');
      }
      setPanelOpen(false);
      setEditing(null);
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save address', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAddress(id).unwrap();
      showToast('Address removed', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to remove address', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">My Addresses</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); setPanelOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <LuPlus size={16} /> ADD ADDRESS
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon="📍" title="No addresses found in your account!" description="Add a delivery address to speed up checkout." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr._id} className="rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{addr.addressType}</span>
                <div className="flex gap-3 text-gray-400">
                  <button type="button" onClick={() => { setEditing(addr); setPanelOpen(true); }} className="hover:text-gray-700">
                    <LuPencil size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(addr._id)} className="hover:text-red-600">
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {addr.addressLine1}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}
              </p>
              <p className="mt-1 text-xs text-gray-400">{addr.countryCode} {addr.phone}</p>
            </div>
          ))}
        </div>
      )}

      <AddressFormPanel
        open={panelOpen}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialValue={editing}
        isSaving={adding || updating}
      />
    </div>
  );
}
