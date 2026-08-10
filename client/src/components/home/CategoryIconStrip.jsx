import { Link } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';

export default function CategoryIconStrip() {
  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });

  return (
    <div className="flex flex-wrap justify-center gap-6 px-6 py-8 lg:px-10">
      {categories.map((cat) => (
        <Link
          key={cat._id}
          to={`/products/category/${cat.slug}`}
          className="flex flex-col items-center gap-2 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-50">
            {cat.image?.url ? (
              <img src={cat.image.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">🛍️</span>
            )}
          </span>
          <span className="text-xs font-medium text-gray-700">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
