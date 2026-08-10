import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import ToastStack from '../ui/ToastStack.jsx';
import { logout } from '../../features/auth/authSlice.js';
import { useLogoutMutation } from '../../features/auth/authApi.js';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const [logoutRequest] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutRequest().unwrap();
    } finally {
      dispatch(logout());
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <ToastStack />
    </div>
  );
}
