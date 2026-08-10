import { LuX } from 'react-icons/lu';

export default function SlidePanel({ open, onClose, title, children, widthClass = 'max-w-md' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close panel" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className={`relative flex h-full w-full ${widthClass} flex-col overflow-y-auto bg-white p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <LuX size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
