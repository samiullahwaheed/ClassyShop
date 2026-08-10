import { useRef } from 'react';
import { LuUploadCloud, LuX } from 'react-icons/lu';
import { useUploadImageMutation } from '../../features/upload/uploadApi.js';
import Spinner from './Spinner.jsx';

export default function ImageUploader({ value, onChange, folder = 'misc' }) {
  const inputRef = useRef(null);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage({ file, folder }).unwrap();
    onChange(result);
    e.target.value = '';
  }

  if (value?.url) {
    return (
      <div className="relative inline-block">
        <img src={value.url} alt="" className="h-32 w-32 rounded-lg border border-gray-200 object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white"
        >
          <LuX size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-400 hover:text-brand-500"
    >
      {isLoading ? <Spinner /> : <LuUploadCloud size={24} />}
      <span className="text-xs">{isLoading ? 'Uploading...' : 'Upload image'}</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </button>
  );
}
