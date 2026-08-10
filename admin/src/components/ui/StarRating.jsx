import { LuStar } from 'react-icons/lu';

export default function StarRating({ value = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} size={size} fill={i < Math.round(value) ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}
