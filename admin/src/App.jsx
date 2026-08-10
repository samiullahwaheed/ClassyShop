import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, setAuthStatus } from './features/auth/authSlice.js';
import { useRefreshTokenMutation } from './features/auth/authApi.js';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CategoryList from './pages/categories/CategoryList.jsx';
import CategoryForm from './pages/categories/CategoryForm.jsx';
import ProductList from './pages/products/ProductList.jsx';
import ProductForm from './pages/products/ProductForm.jsx';
import LookupList from './pages/products/LookupList.jsx';
import UsersList from './pages/users/UsersList.jsx';
import OrdersList from './pages/orders/OrdersList.jsx';
import OrderDetail from './pages/orders/OrderDetail.jsx';
import BannerList from './pages/banners/BannerList.jsx';
import BannerForm from './pages/banners/BannerForm.jsx';
import HomeSlideList from './pages/homeSlides/HomeSlideList.jsx';
import HomeSlideForm from './pages/homeSlides/HomeSlideForm.jsx';
import BlogList from './pages/blogs/BlogList.jsx';
import BlogForm from './pages/blogs/BlogForm.jsx';
import ManageLogo from './pages/logo/ManageLogo.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    dispatch(setAuthStatus('loading'));
    refreshToken()
      .unwrap()
      .then((result) => dispatch(setCredentials(result.data)))
      .catch(() => dispatch(setAuthStatus('unauthenticated')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="home-slides" element={<HomeSlideList />} />
          <Route path="home-slides/add" element={<HomeSlideForm />} />
          <Route path="home-slides/edit/:id" element={<HomeSlideForm />} />

          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />

          <Route path="products" element={<ProductList />} />
          <Route path="products/upload" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/rams" element={<LookupList type="rams" title="Product RAMS" />} />
          <Route path="products/weights" element={<LookupList type="weights" title="Product WEIGHT" />} />
          <Route path="products/sizes" element={<LookupList type="sizes" title="Product SIZE" />} />

          <Route path="users" element={<UsersList />} />

          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetail />} />

          <Route path="banners" element={<BannerList />} />
          <Route path="banners/add" element={<BannerForm />} />
          <Route path="banners/edit/:id" element={<BannerForm />} />

          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/add" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />

          <Route path="logo" element={<ManageLogo />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
