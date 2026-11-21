import React from 'react';
export const panel='gym-surface p-5 shadow-sm';
export const field='w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-sm';
export function Action({children,secondary=false,className='',...props}){return <button type="button" {...props} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 ${secondary?'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800':'bg-cyan-500 text-slate-950 hover:bg-cyan-400'} ${className}`}>{children}</button>;}
export function Empty({children}){return <p className="rounded-xl bg-slate-50 dark:bg-slate-950 p-5 text-sm text-slate-500">{children}</p>;}
