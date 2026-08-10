export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 -z-10"
      />
    </div>
  );
}
