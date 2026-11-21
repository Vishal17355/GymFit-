import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-sm
        transition-all duration-150
        ${hover ? 'hover:border-slate-300 dark:hover:border-slate-700' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => (
  <div className={`p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
    <div>
      {title && <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>}
      {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      {children}
    </div>
    {action && <div className="ml-3 shrink-0">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);
