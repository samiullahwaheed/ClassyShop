import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import { useGetHomeSlidesQuery, useCreateHomeSlidesMutation, useUpdateHomeSlidesMutation } from '../../features/content/contentApi.js';
import { FormField } from '../../components/ui/FormField.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function HomeSlideForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const { data: items = [] } = useGetHomeSlidesQuery();
  const existing = items.find((i) => i._id === id);
  const [createSlide, { isLoading: creating }] = useCreateHomeSlidesMutation();
  const [updateSlide, { isLoading: updating }] = useUpdateHomeSlidesMutation();

  const [form, setForm] = useState({ title: '', subtitle: '', ctaText: 'Shop Now', link: '', image: null });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        subtitle: existing.subtitle || '',
        ctaText: existing.ctaText || 'Shop Now',
        link: existing.link || '',
        image: existing.image,
      });
    }
  }, [existing]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.image) return showToast('Please upload a slide image', 'error');
    try {
      if (isEdit) {
        await updateSlide({ id, ...form }).unwrap();
        showToast('Home slide updated', 'success');
      } else {
        await createSlide(form).unwrap();
        showToast('Home slide created', 'success');
      }
      navigate('/home-slides');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save slide', 'error');
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/home-slides" className="text-gray-400 hover:text-gray-700">
          <LuX size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Home Slide' : 'Add Home Slide'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Slide Image</p>
          <ImageUploader value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} folder="home-slides" />
        </div>
        <FormField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <FormField label="Subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
        <FormField label="CTA Text" value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} />
        <FormField label="Link" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />

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
