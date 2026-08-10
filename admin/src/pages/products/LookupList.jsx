import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useGetLookupQuery, useCreateLookupMutation, useDeleteLookupMutation } from '../../features/products/productsApi.js';
import { FormField } from '../../components/ui/FormField.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function LookupList({ type, title }) {
  const { data: items = [], isLoading } = useGetLookupQuery(type);
  const [createLookup, { isLoading: creating }] = useCreateLookupMutation();
  const [deleteLookup] = useDeleteLookupMutation();
  const [value, setValue] = useState('');
  const showToast = useToast();

  async function handleAdd(e) {
    e.preventDefault();
    if (!value.trim()) return;
    try {
      await createLookup({ type, value: value.trim() }).unwrap();
      setValue('');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to add value', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteLookup({ type, id }).unwrap();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete value', 'error');
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">{title}</h1>

      <form onSubmit={handleAdd} className="mb-6 flex max-w-sm items-end gap-3">
        <FormField label="New value" className="flex-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 8GB" />
        <button type="submit" disabled={creating} className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          Add
        </button>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item._id} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              {item.value}
              <button type="button" onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-600">
                <LuTrash2 size={14} />
              </button>
            </span>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-400">No values yet.</p>}
        </div>
      )}
    </div>
  );
}
