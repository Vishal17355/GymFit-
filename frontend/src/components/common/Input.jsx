import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm
            text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500
            disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30' : 'border-slate-300 dark:border-slate-700'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
