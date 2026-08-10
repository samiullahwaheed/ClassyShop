import { useParams } from 'react-router-dom';
import { useGetBlogQuery } from '../features/content/contentApi.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blog, isLoading } = useGetBlogQuery(slug);

  if (isLoading || !blog) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <img src={blog.image?.url} alt="" className="mb-6 aspect-video w-full rounded-xl object-cover" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{blog.title}</h1>
      <p className="mb-6 text-sm text-gray-400">By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()}</p>
      <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{blog.body}</div>
    </article>
  );
}
