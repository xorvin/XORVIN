import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number; // percentage, positive or negative
  icon: React.ReactNode;
  loading?: boolean;
  /** @deprecated use title instead */
  label?: string;
  /** @deprecated no-op, kept for backward compatibility */
  color?: string;
}

export function MetricCard({
  title,
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  icon,
  loading = false,
}: MetricCardProps) {
  const displayTitle = title || label || '';

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-xorvin-accent/10 transition-colors" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-white/60 text-sm font-medium">{displayTitle}</h3>
        <div className="text-white/40 group-hover:text-xorvin-accent transition-colors">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="h-9 w-24 bg-white/10 rounded animate-pulse mb-1"></div>
        ) : (
          <div className="text-3xl font-bold font-space-grotesk text-white mb-1 flex items-baseline">
            {prefix && <span className="text-lg mr-1">{prefix}</span>}
            {value.toLocaleString()}
            {suffix && <span className="text-lg ml-1">{suffix}</span>}
          </div>
        )}

        {trend !== undefined && !loading && (
          <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white/40'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}% from last month
          </div>
        )}
      </div>
    </div>
  );
}
