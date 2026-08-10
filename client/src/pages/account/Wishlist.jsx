import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../features/user/userApi.js';
import ProductCard from '../../components/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

export default function Wishlist() {
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-gray-900">My List</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState icon="💗" title="Your wishlist is empty" description="Save items you love so you can find them later." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              <button
                type="button"
                onClick={() => removeFromWishlist(product._id)}
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-red-500 shadow"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
