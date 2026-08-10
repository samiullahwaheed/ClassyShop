import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LuMenu, LuChevronDown, LuRocket } from 'react-icons/lu';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import { setMobileMenuOpen } from '../../features/ui/uiSlice.js';

export default function CategoryNavBar() {
  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });
  const dispatch = useDispatch();

  return (
    <nav className="hidden items-center gap-8 border-t border-gray-100 bg-white px-6 py-3 text-sm font-medium text-gray-700 lg:flex lg:px-10">
      <button
        type="button"
        onClick={() => dispatch(setMobileMenuOpen(true))}
        className="flex items-center gap-2 text-gray-900"
      >
        <LuMenu size={18} />
        SHOP BY CATEGORIES
        <LuChevronDown size={14} />
      </button>

      <NavLink to="/" className={({ isActive }) => (isActive ? 'text-brand-500' : 'hover:text-brand-500')}>
        Home
      </NavLink>
      {categories.slice(0, 8).map((cat) => (
        <NavLink
          key={cat._id}
          to={`/products/category/${cat.slug}`}
          className={({ isActive }) => (isActive ? 'text-brand-500' : 'hover:text-brand-500')}
        >
          {cat.name}
        </NavLink>
      ))}

      <span className="ml-auto flex items-center gap-2 text-gray-500">
        <LuRocket size={16} />
        Free International Delivery
      </span>
    </nav>
  );
}
