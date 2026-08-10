import { LuChevronUp, LuChevronDown } from 'react-icons/lu';

export default function QtyStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-14 border-none px-3 py-2 text-center outline-none"
      />
      <div className="flex flex-col border-l border-gray-300">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
        >
          <LuChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
        >
          <LuChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}
