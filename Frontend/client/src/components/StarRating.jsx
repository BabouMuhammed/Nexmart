import { Star } from 'lucide-react';

export function StarRating({ rating = 0, showValue = true, count = 0, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < Math.floor(rating)
                ? 'fill-[#FFD93D] text-[#FFD93D]'
                : 'text-[#64748B]'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-white">{rating.toFixed(1)}</span>
          {count > 0 && <span className="text-sm text-[#A0AEC0]">({count})</span>}
        </div>
      )}
    </div>
  );
}
