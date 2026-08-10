import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/account/AccountSidebar.jsx';

export default function AccountLayout() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:px-10">
      <AccountSidebar />
      <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6">
        <Outlet />
      </div>
    </div>
  );
}
