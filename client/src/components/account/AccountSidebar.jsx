import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuUser, LuMapPin, LuHeart, LuPackage, LuLogOut, LuCircleUserRound } from 'react-icons/lu';
import { selectCurrentUser, logout } from '../../features/auth/authSlice.js';
import { useLogoutMutation } from '../../features/auth/authApi.js';

const items = [
  { label: 'My Profile', to: '/my-account/profile', icon: LuUser },
  { label: 'Address', to: '/my-account/address', icon: LuMapPin },
  { label: 'My List', to: '/my-account/wishlist', icon: LuHeart },
  { label: 'My Orders', to: '/my-account/orders', icon: LuPackage },
];

export default function AccountSidebar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutRequest().unwrap();
    } finally {
      dispatch(logout());
      navigate('/');
    }
  }

  return (
    <aside className="w-full rounded-xl border border-gray-100 bg-white p-6 lg:w-64 lg:shrink-0">
      <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-5 text-center">
        {user?.avatar?.url ? (
          <img src={user.avatar.url} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <LuCircleUserRound size={80} className="text-gray-200" />
        )}
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium ${
                isActive ? 'border-brand-500 bg-gray-50 text-brand-600' : 'border-transparent text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <LuLogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
