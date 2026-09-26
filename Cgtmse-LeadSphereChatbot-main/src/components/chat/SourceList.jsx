import React from 'react';
import { ExternalLink, BookMarked } from 'lucide-react';

export default function SourceList({ sources }) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2 tracking-wide uppercase">
        <BookMarked size={12} className="text-blue-600 dark:text-blue-400" />
        <span>Sources</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          const title = source.title || `Source ${index + 1}`;
          const section = source.section ? ` (${source.section})` : '';
          const isUrl = Boolean(source.url && source.url.startsWith('http'));

          if (isUrl) {
            return (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[11px] text-zinc-700 hover:text-blue-600 hover:bg-zinc-200 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60 dark:hover:text-blue-300 dark:hover:bg-zinc-700/80 transition"
              >
                <span className="truncate max-w-[220px]">
                  {title}{section}
                </span>
                <ExternalLink size={10} className="flex-shrink-0 opacity-70" />
              </a>
            );
          }

          return (
            <span
              key={index}
              className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[11px] text-zinc-700 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60"
            >
              <span className="truncate max-w-[220px]">
                {title}{section}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
