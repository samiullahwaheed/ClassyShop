export function FormField({ label, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <input
        {...props}
        className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
    </label>
  );
}

export function FormTextarea({ label, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <textarea
        {...props}
        rows={props.rows || 5}
        className="resize-y rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
    </label>
  );
}

export function FormSelect({ label, className = '', children, ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <select
        {...props}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      >
        {children}
      </select>
    </label>
  );
}
