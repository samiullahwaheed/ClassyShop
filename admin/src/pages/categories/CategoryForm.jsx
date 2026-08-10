import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '../../features/categories/categoriesApi.js';
import { FormField, FormSelect } from '../../components/ui/FormField.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: existing } = useGetCategoryQuery(id, { skip: !isEdit });
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  const [form, setForm] = useState({
    name: '',
    parentCategory: '',
    level: 0,
    image: null,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        parentCategory: existing.parentCategory || '',
        level: existing.level,
        image: existing.image,
      });
    }
  }, [existing]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      level: Number(form.level),
      parentCategory: form.parentCategory || null,
      image: form.image,
    };
    try {
      if (isEdit) {
        await updateCategory({ id, ...payload }).unwrap();
        showToast('Category updated', 'success');
      } else {
        await createCategory(payload).unwrap();
        showToast('Category created', 'success');
      }
      navigate('/categories');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save category', 'error');
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/categories" className="text-gray-400 hover:text-gray-700">
          <LuX size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Category' : 'Add Category'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
        <FormField
          label="Category Name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <FormSelect
          label="Level"
          value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
        >
          <option value={0}>Top Level Category</option>
          <option value={1}>Sub Category</option>
          <option value={2}>Third Level Category</option>
        </FormSelect>

        {Number(form.level) > 0 && (
          <FormSelect
            label="Parent Category"
            value={form.parentCategory}
            onChange={(e) => setForm((f) => ({ ...f, parentCategory: e.target.value }))}
          >
            <option value="">Select parent</option>
            {categories
              .filter((c) => c.level === Number(form.level) - 1)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </FormSelect>
        )}

        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Category Image</p>
          <ImageUploader value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} folder="categories" />
        </div>

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
