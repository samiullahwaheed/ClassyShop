import { Link } from 'react-router-dom';
import { useGetBlogsQuery } from '../features/content/contentApi.js';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function Blog() {
  const { data: blogs = [], isLoading } = useGetBlogsQuery();

  return (
    <div className="px-6 py-8 lg:px-10">
      <h1 className="mb-6 text-xl font-bold text-gray-900">From The Blog</h1>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState icon="📰" title="No blog posts yet" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-gray-100">
              <img src={blog.image?.url} alt="" className="aspect-video w-full object-cover transition group-hover:scale-105" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-semibold text-gray-800">{blog.title}</p>
                <p className="line-clamp-2 text-sm text-gray-500">{blog.excerpt}</p>
                <span className="mt-auto text-xs font-medium text-brand-500">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
