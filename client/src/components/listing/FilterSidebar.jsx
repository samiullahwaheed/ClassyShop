import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import StarRating from '../ui/StarRating.jsx';

export default function FilterSidebar({ filters, onChange }) {
  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });

  function toggleCategory(id) {
    onChange({ ...filters, category: filters.category === id ? '' : id });
  }

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-64 lg:shrink-0">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Shop by Category</h3>
        <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto text-sm text-gray-600">
          {categories.map((cat) => (
            <li key={cat._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.category === cat._id}
                onChange={() => toggleCategory(cat._id)}
                className="accent-brand-500"
              />
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Filter By Price</h3>
        <input
          type="range"
          min={0}
          max={60000}
          step={500}
          value={filters.priceMax || 60000}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>From: Rs: 0</span>
          <span>To: Rs: {filters.priceMax || 60000}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Filter By Rating</h3>
        <ul className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <li key={r} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.rating === r}
                onChange={() => onChange({ ...filters, rating: filters.rating === r ? '' : r })}
                className="accent-brand-500"
              />
              <StarRating value={r} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
