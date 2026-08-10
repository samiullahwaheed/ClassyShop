import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { LuSearch, LuHeart, LuShoppingCart, LuCircleUserRound } from 'react-icons/lu';
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/authSlice.js';
import { selectCartCount } from '../../features/cart/cartSlice.js';
import { setCartDrawerOpen } from '../../features/ui/uiSlice.js';

export default function Header() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-xl text-white">
          🚚
        </span>
        <div className="leading-tight">
          <p className="text-lg font-extrabold tracking-tight text-gray-900">CLASSYSHOP</p>
          <p className="text-[10px] font-medium tracking-wide text-gray-400">BIG MEGA STORE</p>
        </div>
      </Link>

      <form onSubmit={handleSearch} className="order-3 w-full sm:order-none sm:max-w-xl sm:flex-1">
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="text-gray-500">
            <LuSearch size={18} />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <Link to="/my-account" className="flex items-center gap-2 text-sm text-gray-700">
            <LuCircleUserRound size={26} className="text-gray-400" />
            <span className="hidden leading-tight sm:block">
              <span className="block font-medium">{user?.name}</span>
              <span className="block text-xs text-gray-400">{user?.email}</span>
            </span>
          </Link>
        ) : (
          <p className="text-sm text-gray-700">
            <Link to="/login" className="hover:text-brand-500">
              Login
            </Link>{' '}
            |{' '}
            <Link to="/register" className="hover:text-brand-500">
              Register
            </Link>
          </p>
        )}

        <Link to="/my-account/wishlist" className="text-gray-600 hover:text-brand-500">
          <LuHeart size={22} />
        </Link>

        <button
          type="button"
          onClick={() => dispatch(setCartDrawerOpen(true))}
          className="relative text-gray-600 hover:text-brand-500"
        >
          <LuShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
