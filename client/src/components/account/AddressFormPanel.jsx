import { useState, useEffect } from 'react';
import SlidePanel from '../ui/SlidePanel.jsx';

const EMPTY = {
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  countryCode: '+91',
  phone: '',
  landmark: '',
  addressType: 'Home',
};

export default function AddressFormPanel({ open, onClose, onSubmit, initialValue, isSaving }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initialValue ? { ...EMPTY, ...initialValue } : EMPTY);
  }, [open, initialValue]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <SlidePanel open={open} onClose={onClose} title="Add Delivery Address">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <input
          required
          placeholder="Address Line 1"
          value={form.addressLine1}
          onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          required
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          required
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          required
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          required
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <div className="flex gap-2">
          <select
            value={form.countryCode}
            onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
            className="rounded-lg border border-gray-300 px-2 py-3 text-sm"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <input
          placeholder="Landmark"
          value={form.landmark}
          onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Address Type</p>
          <div className="flex gap-5">
            {['Home', 'Office'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="addressType"
                  checked={form.addressType === type}
                  onChange={() => setForm((f) => ({ ...f, addressType: type }))}
                  className="accent-brand-500"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-auto rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          SAVE
        </button>
      </form>
    </SlidePanel>
  );
}
