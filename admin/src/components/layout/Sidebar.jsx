import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuLayoutGrid,
  LuImage,
  LuBox,
  LuUsers,
  LuShoppingBag,
  LuGalleryHorizontalEnd,
  LuNewspaper,
  LuLayers,
  LuLogOut,
  LuChevronDown,
} from 'react-icons/lu';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LuLayoutGrid, end: true },
  {
    label: 'Home Slides',
    icon: LuImage,
    children: [{ label: 'Home Slides List', to: '/home-slides' }],
  },
  {
    label: 'Category',
    icon: LuLayoutGrid,
    children: [{ label: 'Category List', to: '/categories' }],
  },
  {
    label: 'Products',
    icon: LuBox,
    children: [
      { label: 'Product List', to: '/products' },
      { label: 'Product Upload', to: '/products/upload' },
      { label: 'Add Product RAMS', to: '/products/rams' },
      { label: 'Add Product WEIGHT', to: '/products/weights' },
      { label: 'Add Product SIZE', to: '/products/sizes' },
    ],
  },
  { label: 'Users', to: '/users', icon: LuUsers },
  { label: 'Orders', to: '/orders', icon: LuShoppingBag },
  {
    label: 'Banners',
    icon: LuGalleryHorizontalEnd,
    children: [{ label: 'Banners List', to: '/banners' }],
  },
  {
    label: 'Blogs',
    icon: LuNewspaper,
    children: [{ label: 'Blogs List', to: '/blogs' }],
  },
  { label: 'Manage Logo', to: '/logo', icon: LuLayers },
];

function NavGroup({ item }) {
  const [open, setOpen] = useState(true);
  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {item.label}
        </span>
        <LuChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-8 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `rounded-md px-2 py-1.5 text-sm ${
                  isActive ? 'bg-brand-50 font-medium text-brand-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onLogout }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-gray-200 bg-white">
      <div>
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg text-white">
            🚚
          </span>
          <div className="leading-tight">
            <p className="text-base font-extrabold tracking-tight text-gray-900">CLASSYSHOP</p>
            <p className="text-[10px] font-medium tracking-wide text-gray-400">BIG MEGA STORE</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 pb-4">
          {navItems.map((item) =>
            item.children ? (
              <NavGroup key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <LuLogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
