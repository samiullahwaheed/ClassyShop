import { LuLayoutGrid, LuList } from 'react-icons/lu';

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`rounded-md p-1.5 ${view === 'list' ? 'bg-brand-500 text-white' : 'text-gray-400'}`}
      >
        <LuList size={18} />
      </button>
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-400'}`}
      >
        <LuLayoutGrid size={18} />
      </button>
    </div>
  );
}
