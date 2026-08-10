import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LuShoppingCart } from 'react-icons/lu';
import StarRating from './ui/StarRating.jsx';
import { DiscountBadge } from './ui/PriceDisplay.jsx';
import { addItem } from '../features/cart/cartSlice.js';
import { setCartDrawerOpen } from '../features/ui/uiSlice.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: 1,
        size: product.sizes?.[0],
        stock: product.stock,
      })
    );
    dispatch(setCartDrawerOpen(true));
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <DiscountBadge oldPrice={product.oldPrice} price={product.price} />
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.brand}</p>
        <p className="line-clamp-2 text-sm font-medium text-gray-800">{product.name}</p>
        <StarRating value={product.rating?.average} />
        <div className="flex items-center gap-2 text-sm">
          {product.oldPrice > product.price && (
            <span className="text-gray-400 line-through">₹{product.oldPrice.toFixed(2)}</span>
          )}
          <span className="font-semibold text-gray-900">₹{product.price.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-brand-500 py-2 text-xs font-semibold text-brand-500 transition hover:bg-brand-500 hover:text-white"
        >
          <LuShoppingCart size={14} /> ADD TO CART
        </button>
      </div>
    </Link>
  );
}
