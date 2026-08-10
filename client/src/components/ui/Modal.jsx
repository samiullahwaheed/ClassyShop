export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
        {children}
      </div>
      <button type="button" aria-label="Close modal" onClick={onClose} className="fixed inset-0 -z-10" />
    </div>
  );
}
