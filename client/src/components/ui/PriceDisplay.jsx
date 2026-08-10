export default function PriceDisplay({ price, oldPrice, size = 'md' }) {
  const textSize = size === 'lg' ? 'text-2xl' : 'text-sm';
  return (
    <div className="flex items-center gap-2">
      {oldPrice > price && <span className="text-gray-400 line-through">₹{oldPrice.toFixed(2)}</span>}
      <span className={`font-semibold text-gray-900 ${textSize}`}>₹{price.toFixed(2)}</span>
    </div>
  );
}

export function DiscountBadge({ oldPrice, price }) {
  if (!(oldPrice > price)) return null;
  const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
  return (
    <span className="absolute left-2 top-2 rounded-md bg-brand-500 px-2 py-1 text-xs font-bold text-white">
      {percent}%
    </span>
  );
}
