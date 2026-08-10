import { Outlet } from 'react-router-dom';
import TopUtilityBar from './TopUtilityBar.jsx';
import Header from './Header.jsx';
import CategoryNavBar from './CategoryNavBar.jsx';
import MobileCategoryDrawer from './MobileCategoryDrawer.jsx';
import Footer from './Footer.jsx';
import TrustBadgeStrip from './TrustBadgeStrip.jsx';
import CartDrawer from './CartDrawer.jsx';
import ToastStack from '../ui/ToastStack.jsx';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopUtilityBar />
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <Header />
        <CategoryNavBar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <TrustBadgeStrip />
      <Footer />

      <MobileCategoryDrawer />
      <CartDrawer />
      <ToastStack />
    </div>
  );
}
