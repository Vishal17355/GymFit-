import React from 'react';
import { Card, CardBody } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
}) => {
  return (
    <Card hover className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {Icon && (
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            {value}
          </span>
          {change && (
            <span className={`inline-flex items-center text-[11px] font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {subtitle}
          </p>
        )}
      </CardBody>
    </Card>
  );
};
