import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import {
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetLookupQuery,
} from '../../features/products/productsApi.js';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import { FormField, FormSelect, FormTextarea } from '../../components/ui/FormField.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { useToast } from '../../hooks/useToast.js';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: '',
  subCategory: '',
  thirdLevelCategory: '',
  price: '',
  oldPrice: '',
  isFeatured: false,
  stock: '',
  brand: '',
  sizes: [],
  weights: [],
  rams: [],
  images: [],
};

function ChipCheckboxGroup({ label, options, selected, onToggle }) {
  if (!options.length) return null;
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt._id}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                active ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-300 text-gray-600'
              }`}
            >
              {opt.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: existing } = useGetProductQuery(id, { skip: !isEdit });
  const { data: rams = [] } = useGetLookupQuery('rams');
  const { data: weights = [] } = useGetLookupQuery('weights');
  const { data: sizes = [] } = useGetLookupQuery('sizes');

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        category: existing.category?._id || existing.category || '',
        subCategory: existing.subCategory?._id || existing.subCategory || '',
        thirdLevelCategory: existing.thirdLevelCategory?._id || existing.thirdLevelCategory || '',
        price: existing.price,
        oldPrice: existing.oldPrice || '',
        isFeatured: existing.isFeatured,
        stock: existing.stock,
        brand: existing.brand || '',
        sizes: existing.sizes || [],
        weights: existing.weights || [],
        rams: existing.rams || [],
        images: existing.images || [],
      });
    }
  }, [existing]);

  const subCategories = categories.filter((c) => c.level === 1 && c.parentCategory === form.category);
  const thirdLevelCategories = categories.filter((c) => c.level === 2 && c.parentCategory === form.subCategory);

  function toggleChip(field, value) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
      subCategory: form.subCategory || undefined,
      thirdLevelCategory: form.thirdLevelCategory || undefined,
    };
    try {
      if (isEdit) {
        await updateProduct({ id, ...payload }).unwrap();
        showToast('Product updated', 'success');
      } else {
        await createProduct(payload).unwrap();
        showToast('Product published', 'success');
      }
      navigate('/products');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to save product', 'error');
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/products" className="text-gray-400 hover:text-gray-700">
          <LuX size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Product Name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <FormTextarea
          label="Product Description"
          required
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <FormSelect
            label="Product Category"
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subCategory: '', thirdLevelCategory: '' }))}
          >
            <option value="">Select</option>
            {categories.filter((c) => c.level === 0).map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Product Sub Category"
            value={form.subCategory}
            onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value, thirdLevelCategory: '' }))}
          >
            <option value="">Select</option>
            {subCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Product Third Level Category"
            value={form.thirdLevelCategory}
            onChange={(e) => setForm((f) => ({ ...f, thirdLevelCategory: e.target.value }))}
          >
            <option value="">Select</option>
            {thirdLevelCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </FormSelect>

          <FormField
            label="Product Price"
            type="number"
            required
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <FormField
            label="Product Old Price"
            type="number"
            min="0"
            value={form.oldPrice}
            onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))}
          />
          <FormSelect
            label="Is Featured?"
            value={form.isFeatured ? 'yes' : 'no'}
            onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.value === 'yes' }))}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </FormSelect>
          <FormField
            label="Product Stock"
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
          <FormField
            label="Product Brand"
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ChipCheckboxGroup label="Product RAMS" options={rams} selected={form.rams} onToggle={(v) => toggleChip('rams', v)} />
          <ChipCheckboxGroup label="Product Weight" options={weights} selected={form.weights} onToggle={(v) => toggleChip('weights', v)} />
          <ChipCheckboxGroup label="Product Size" options={sizes} selected={form.sizes} onToggle={(v) => toggleChip('sizes', v)} />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Product Images</p>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, idx) => (
              <div key={img.public_id || idx} className="relative">
                <img src={img.url} alt="" className="h-24 w-24 rounded-lg border border-gray-200 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white"
                >
                  <LuX size={14} />
                </button>
              </div>
            ))}
            <ImageUploader
              value={null}
              folder="products"
              onChange={(img) => img && setForm((f) => ({ ...f, images: [...f.images, img] }))}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating || updating}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isEdit ? 'SAVE CHANGES' : 'PUBLISH AND VIEW'}
        </button>
      </form>
    </div>
  );
}
