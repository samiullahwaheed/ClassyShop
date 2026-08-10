import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';
import Spinner from '../ui/Spinner.jsx';

// Renders a titled product grid; used for "Popular Products", "Latest Products",
// "Featured Products", and the per-category rails (Bags/Electronics/Footwear/Groceries).
export default function ProductSection({ title, products, isLoading, viewAllHref, limit = 6 }) {
  if (!isLoading && !products?.length) return null;

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {viewAllHref && (
          <Link to={viewAllHref} className="text-sm font-medium text-brand-500 hover:underline">
            View All →
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.slice(0, limit).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
