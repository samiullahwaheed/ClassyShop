export default function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
      {onLimitChange && (
        <label className="flex items-center gap-2">
          Rows per page:
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      <span>
        {total === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-30"
        >
          ‹
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}
