import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuX, LuPlus, LuMinus } from 'react-icons/lu';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import { setMobileMenuOpen } from '../../features/ui/uiSlice.js';

export default function MobileCategoryDrawer() {
  const open = useSelector((state) => state.ui.mobileMenuOpen);
  const dispatch = useDispatch();
  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });
  const [expanded, setExpanded] = useState(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex h-full w-80 max-w-full flex-col overflow-y-auto bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Shop By Categories</h2>
          <button type="button" onClick={() => dispatch(setMobileMenuOpen(false))} className="text-gray-400">
            <LuX size={22} />
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-gray-100">
          {categories.map((cat) => (
            <li key={cat._id} className="py-3">
              <div className="flex items-center justify-between">
                <Link
                  to={`/products/category/${cat.slug}`}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="font-medium text-gray-800"
                >
                  {cat.name}
                </Link>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}
                  className="text-gray-400"
                >
                  {expanded === cat._id ? <LuMinus size={16} /> : <LuPlus size={16} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-label="Close category menu"
        onClick={() => dispatch(setMobileMenuOpen(false))}
        className="flex-1 bg-black/40"
      />
    </div>
  );
}
