import { LuTruck } from 'react-icons/lu';
import HeroCarousel from '../components/home/HeroCarousel.jsx';
import CategoryIconStrip from '../components/home/CategoryIconStrip.jsx';
import ProductSection from '../components/home/ProductSection.jsx';
import PromoBanner from '../components/home/PromoBanner.jsx';
import BlogSection from '../components/home/BlogSection.jsx';
import { useGetProductsQuery } from '../features/products/productsApi.js';
import { useGetBannersQuery } from '../features/content/contentApi.js';
import { useGetCategoriesQuery } from '../features/categories/categoriesApi.js';

export default function Home() {
  const { data: popular, isLoading: popularLoading } = useGetProductsQuery({ limit: 6, sort: 'rating' });
  const { data: latest, isLoading: latestLoading } = useGetProductsQuery({ limit: 6, sort: 'newest' });
  const { data: featured, isLoading: featuredLoading } = useGetProductsQuery({ limit: 6, isFeatured: true });
  const { data: banners = [] } = useGetBannersQuery();
  const { data: categories = [] } = useGetCategoriesQuery({ level: 0 });

  return (
    <div>
      <HeroCarousel />
      <CategoryIconStrip />

      <ProductSection title="Popular Products" products={popular?.data} isLoading={popularLoading} viewAllHref="/products" />

      {banners.length > 0 && (
        <section className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-3 lg:px-10">
          {banners.slice(0, 3).map((b) => (
            <PromoBanner key={b._id} banner={b} />
          ))}
        </section>
      )}

      <div className="mx-6 flex items-center justify-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-6 py-4 text-sm font-medium text-gray-700 lg:mx-10">
        <LuTruck size={20} className="text-brand-500" />
        FREE SHIPPING &mdash; Free Delivery Now On Your First Order and over $200
        <span className="font-semibold text-brand-500">- Only $200*</span>
      </div>

      <ProductSection title="Latest Products" products={latest?.data} isLoading={latestLoading} viewAllHref="/products?sort=newest" />
      <ProductSection title="Featured Products" products={featured?.data} isLoading={featuredLoading} viewAllHref="/products?isFeatured=true" />

      {categories.slice(0, 4).map((cat) => (
        <CategoryRail key={cat._id} category={cat} />
      ))}

      <BlogSection />
    </div>
  );
}

function CategoryRail({ category }) {
  const { data, isLoading } = useGetProductsQuery({ category: category._id, limit: 6 });
  return (
    <ProductSection
      title={category.name}
      products={data?.data}
      isLoading={isLoading}
      viewAllHref={`/products/category/${category.slug}`}
    />
  );
}
