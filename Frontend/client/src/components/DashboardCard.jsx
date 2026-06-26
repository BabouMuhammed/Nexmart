import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function DashboardCard({ title, value, change, icon: Icon, accent = 'cyan' }) {
  const isPositive = change >= 0;
  const accentColor = accent === 'cyan' ? '#00E5D4' : '#8B5CF6';

  return (
    <GlassCard glow={accent}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#A0AEC0] text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        </div>
        {Icon && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
