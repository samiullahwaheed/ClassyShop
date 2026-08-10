import { Link } from 'react-router-dom';

export default function PromoBanner({ banner }) {
  return (
    <Link
      to={banner.link || '/products'}
      className="relative flex min-h-[140px] items-end overflow-hidden rounded-xl bg-cover bg-center p-5"
      style={{ backgroundImage: `url(${banner.image?.url})` }}
    >
      <div className="rounded-lg bg-white/90 px-4 py-2">
        {banner.title && <p className="text-sm font-semibold text-gray-900">{banner.title}</p>}
        <span className="text-xs font-medium text-brand-500">Shop Now →</span>
      </div>
    </Link>
  );
}
