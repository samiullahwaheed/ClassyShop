import { useState } from 'react';
import Spinner from './Spinner.jsx';

// Generic list table reused across Products/Categories/Users/Orders/Banners/Blogs.
// `columns`: [{ key, header, render?(row) }]. `rowKey` defaults to row._id.
export default function DataTable({
  columns,
  rows,
  isLoading,
  selectable = false,
  rowKey = (row) => row._id,
  emptyMessage = 'No records found.',
}) {
  const [selected, setSelected] = useState(new Set());

  function toggleAll(checked) {
    setSelected(checked ? new Set(rows.map(rowKey)) : new Set());
  }
  function toggleOne(id, checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) => toggleAll(e.target.checked)}
                  checked={rows.length > 0 && selected.size === rows.length}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-10 text-center">
                <Spinner className="mx-auto" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-10 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = rowKey(row);
              return (
                <tr key={id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={(e) => toggleOne(id, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
