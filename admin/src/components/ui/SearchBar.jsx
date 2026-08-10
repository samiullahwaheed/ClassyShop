import { LuSearch } from 'react-icons/lu';

export default function SearchBar({ value, onChange, placeholder = 'Search here...' }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
      <LuSearch size={16} className="text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-[180px] outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
