import { useDispatch } from 'react-redux';
import { pushToast, removeToast } from '../features/ui/uiSlice.js';

export function useToast() {
  const dispatch = useDispatch();

  return function showToast(message, type = 'info') {
    const id = Date.now();
    dispatch(pushToast({ id, message, type }));
    setTimeout(() => dispatch(removeToast(id)), 3500);
  };
}
