import { LuMenu, LuBell, LuCircleUserRound } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice.js';

export default function Topbar({ onToggleSidebar }) {
  const user = useSelector(selectCurrentUser);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <LuMenu size={22} />
      </button>
      <div />
      <div className="flex items-center gap-5">
        <button type="button" className="relative text-gray-500 hover:text-gray-700">
          <LuBell size={20} />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
            4
          </span>
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <LuCircleUserRound size={26} className="text-gray-400" />
          <span className="hidden font-medium sm:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
