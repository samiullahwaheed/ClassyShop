import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../features/ui/uiSlice.js';

export default function ToastStack() {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-gray-800'
          }`}
        >
          {toast.message}
          <button type="button" onClick={() => dispatch(removeToast(toast.id))} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
