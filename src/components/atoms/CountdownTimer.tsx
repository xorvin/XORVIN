import React, { useEffect, useState } from 'react';
import { getCountdown } from '@/utils/formatDate';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({ targetDate, className = '', compact = false }: CountdownTimerProps) {
  const [time, setTime] = useState(getCountdown(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getCountdown(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (compact) {
    return (
      <span className={`font-mono text-xorvin-accent text-sm ${className}`}>
        {time.days}d {time.hours}h {time.minutes}m
      </span>
    );
  }

  const units = [
    { label: 'Days',    value: time.days    },
    { label: 'Hours',   value: time.hours   },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Countdown timer">
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="flex flex-col items-center">
            <div className="glass-card rounded-xl px-4 py-3 min-w-[60px] text-center">
              <span className="text-2xl font-bold font-space-grotesk gradient-text tabular-nums">
                {String(u.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-white/50 mt-1 font-inter">{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold text-xorvin-primary mb-5">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
