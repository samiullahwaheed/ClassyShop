import { Link } from 'react-router-dom';
import { LuFacebook, LuYoutube, LuInstagram } from 'react-icons/lu';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="grid grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Contact us</h3>
          <p className="text-sm text-gray-500">Classyshop - Mega Super Store</p>
          <p className="text-sm text-gray-500">507-Union Trade Centre France</p>
          <p className="mt-3 text-sm text-gray-500">sales@yourcompany.com</p>
          <p className="mt-1 text-lg font-semibold text-brand-500">(+91) 9876-543-210</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Products</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-500">
            <li><Link to="/products" className="hover:text-brand-500">Prices drop</Link></li>
            <li><Link to="/products" className="hover:text-brand-500">New products</Link></li>
            <li><Link to="/products" className="hover:text-brand-500">Best sales</Link></li>
            <li><Link to="/contact" className="hover:text-brand-500">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Our company</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-brand-500">About us</Link></li>
            <li><Link to="/terms" className="hover:text-brand-500">Terms and conditions of use</Link></li>
            <li><Link to="/login" className="hover:text-brand-500">Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Subscribe to newsletter</h3>
          <p className="mb-3 text-sm text-gray-500">Subscribe to our latest newsletter to get news about special discounts.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your Email Address"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-6 text-xs text-gray-500 sm:flex-row lg:px-10">
        <div className="flex gap-3">
          {[LuFacebook, LuYoutube, LuInstagram].map((Icon, i) => (
            <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300">
              <Icon size={16} />
            </span>
          ))}
        </div>
        <p>© {new Date().getFullYear()} - Ecommerce Template</p>
      </div>
    </footer>
  );
}
