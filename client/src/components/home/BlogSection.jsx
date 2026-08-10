import { Link } from 'react-router-dom';
import { useGetBlogsQuery } from '../../features/content/contentApi.js';

export default function BlogSection() {
  const { data: blogs = [] } = useGetBlogsQuery();

  if (!blogs.length) return null;

  return (
    <section className="px-6 py-8 lg:px-10">
      <h2 className="mb-4 text-lg font-bold text-gray-900">From The Blog</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.slice(0, 4).map((blog) => (
          <Link key={blog._id} to={`/blog/${blog.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-gray-100">
            <img src={blog.image?.url} alt="" className="aspect-video w-full object-cover transition group-hover:scale-105" />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <p className="line-clamp-2 text-sm font-semibold text-gray-800">{blog.title}</p>
              <p className="line-clamp-2 text-xs text-gray-500">{blog.excerpt}</p>
              <span className="mt-auto text-xs font-medium text-brand-500">Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
