import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productsApi.js';
import { useGetCategoryQuery } from '../features/categories/categoriesApi.js';
import FilterSidebar from '../components/listing/FilterSidebar.jsx';
import SortDropdown from '../components/listing/SortDropdown.jsx';
import ViewToggle from '../components/listing/ViewToggle.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function ProductListing() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { data: category } = useGetCategoryQuery(slug, { skip: !slug });

  const [filters, setFilters] = useState({ category: '', priceMax: '', rating: '' });
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [view, setView] = useState('grid');

  const queryArgs = useMemo(
    () => ({
      category: category?._id || filters.category || undefined,
      priceMax: filters.priceMax || undefined,
      rating: filters.rating || undefined,
      sort: sort || undefined,
      search: searchParams.get('search') || undefined,
      isFeatured: searchParams.get('isFeatured') || undefined,
      limit: 24,
    }),
    [category, filters, sort, searchParams]
  );

  const { data, isLoading } = useGetProductsQuery(queryArgs);
  const products = data?.data || [];

  return (
    <div className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:px-10">
      <FilterSidebar filters={filters} onChange={setFilters} />

      <div className="flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <p className="text-sm text-gray-600">
              {category ? category.name : 'All Products'} &mdash; There are {products.length} products.
            </p>
          </div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon="🔍" title="No products found" description="Try adjusting your filters or search." />
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4' : 'flex flex-col gap-4'}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
