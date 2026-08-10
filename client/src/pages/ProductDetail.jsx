import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuHeart, LuShuffle, LuCheck } from 'react-icons/lu';
import { useGetProductQuery } from '../features/products/productsApi.js';
import { useGetReviewsQuery, useCreateReviewMutation } from '../features/reviews/reviewsApi.js';
import { useAddToWishlistMutation } from '../features/user/userApi.js';
import { selectIsAuthenticated } from '../features/auth/authSlice.js';
import { addItem } from '../features/cart/cartSlice.js';
import { setCartDrawerOpen } from '../features/ui/uiSlice.js';
import { useToast } from '../hooks/useToast.js';
import StarRating from '../components/ui/StarRating.jsx';
import QtyStepper from '../components/ui/QtyStepper.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useGetProductQuery(slug);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const showToast = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addToWishlist] = useAddToWishlistMutation();

  useEffect(() => {
    if (product?.sizes?.length) setSize(product.sizes[0]);
    setActiveImage(0);
    setAdded(false);
  }, [product]);

  if (isLoading || !product) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  function handleAddToCart() {
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: qty,
        size,
        stock: product.stock,
      })
    );
    setAdded(true);
    dispatch(setCartDrawerOpen(true));
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleWishlist() {
    if (!isAuthenticated) return showToast('Please log in to save items to your wishlist', 'error');
    try {
      await addToWishlist(product._id).unwrap();
      showToast('Added to wishlist', 'success');
    } catch {
      showToast('Failed to add to wishlist', 'error');
    }
  }

  return (
    <div className="flex flex-col gap-10 px-6 py-8 lg:px-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[100px_1fr_1fr]">
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {product.images?.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                activeImage === idx ? 'border-brand-500' : 'border-gray-200'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="order-1 aspect-square overflow-hidden rounded-xl bg-gray-50 lg:order-2">
          <img src={product.images?.[activeImage]?.url} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="order-3 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              Brands: <span className="font-medium text-gray-700">{product.brand}</span>
            </span>
            <StarRating value={product.rating?.average} />
            <a href="#reviews" className="text-brand-500 hover:underline">
              Review ({product.rating?.count || 0})
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            {product.oldPrice > product.price && (
              <span className="text-gray-400 line-through">₹{product.oldPrice.toFixed(2)}</span>
            )}
            <span className="font-medium text-green-600">Available In Stock: {product.stock} Items</span>
          </div>

          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">SIZE:</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                      size === s ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">Free Shipping (Est. Delivery Time 2-3 Days)</p>

          <div className="flex items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} max={product.stock} />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {added ? <LuCheck size={16} /> : null}
              {added ? 'ADDED' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>

          <div className="flex items-center gap-5 text-sm text-gray-600">
            <button type="button" onClick={handleWishlist} className="flex items-center gap-1.5 hover:text-brand-500">
              <LuHeart size={16} /> Add to Wishlist
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-brand-500">
              <LuShuffle size={16} /> Add to Compare
            </button>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product._id} />
    </div>
  );
}

function ReviewsSection({ productId }) {
  const { data: reviews = [] } = useGetReviewsQuery(productId);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      setComment('');
      showToast('Review submitted', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to submit review', 'error');
    }
  }

  return (
    <section id="reviews" className="border-t border-gray-100 pt-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Reviews ({reviews.length})</h2>

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r._id} className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{r.user?.name}</p>
              <StarRating value={r.rating} size={12} />
            </div>
            {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-gray-400">No reviews yet. Be the first to review this product.</p>}
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            Your rating
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={3}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="self-start rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            Submit Review
          </button>
        </form>
      )}
    </section>
  );
}
