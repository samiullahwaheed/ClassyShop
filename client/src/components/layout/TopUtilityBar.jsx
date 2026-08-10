import { Link } from 'react-router-dom';

export default function TopUtilityBar() {
  return (
    <div className="hidden items-center justify-between bg-white px-6 py-2 text-xs text-gray-600 sm:flex lg:px-10">
      <p>
        Get up to 50% off new season styles, <span className="text-brand-500 underline">limited time only</span>
      </p>
      <div className="flex items-center gap-5">
        <Link to="/help" className="hover:text-brand-500">
          Help Center
        </Link>
        <Link to="/my-account/orders" className="hover:text-brand-500">
          Order Tracking
        </Link>
      </div>
    </div>
  );
}
