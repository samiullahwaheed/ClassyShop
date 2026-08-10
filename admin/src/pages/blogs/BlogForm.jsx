import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import { useGetBlogsQuery, useCreateBlogsMutation, useUpdateBlogsMutation } from '../../features/content/contentApi.js';
import { FormField, FormTextarea } from '../../components/ui/FormField.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const { data: items = [] } = useGetBlogsQuery();
  const existing = items.find((i) => i._id === id);
  const [createBlog, { isLoading: creating }] = useCreateBlogsMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogsMutation();

  const [form, setForm] = useState({ title: '', excerpt: '', body: '', author: 'Admin', image: null });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        excerpt: existing.excerpt || '',
        body: existing.body,
        author: existing.author || 'Admin',
        image: existing.image,
      });
    }
  }, [existing]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateBlog({ id, ...form }).unwrap();
        showToast('Blog post updated', 'success');
      } else {
        await createBlog(form).unwrap();
        showToast('Blog post created', 'success');
      }
      navigate('/blogs');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save post', 'error');
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/blogs" className="text-gray-400 hover:text-gray-700">
          <LuX size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Blog Post' : 'Add Blog Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Cover Image</p>
          <ImageUploader value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} folder="blogs" />
        </div>
        <FormField label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <FormField label="Excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
        <FormTextarea label="Body" required rows={8} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
        <FormField label="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />

        <button
          type="submit"
          disabled={creating || updating}
          className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isEdit ? 'SAVE CHANGES' : 'PUBLISH AND VIEW'}
        </button>
      </form>
    </div>
  );
}
