import React from 'react';
import { User } from 'lucide-react';
import { formatMessageTime } from '../../utils/formatDate';

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end py-3 max-w-chat mx-auto w-full animate-fade-in">
      <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
        <div className="flex flex-col items-end min-w-0">
          <div className="rounded-2xl rounded-tr-sm bg-zinc-200/90 px-4 py-3 border border-zinc-300 text-xs sm:text-sm text-zinc-900 shadow-sm dark:bg-[#212124] dark:border-[#2D2D32] dark:text-zinc-100">
            <p className="whitespace-pre-wrap leading-relaxed break-words">
              {message.content}
            </p>
          </div>
          {message.createdAt && (
            <span className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 pr-1">
              {formatMessageTime(message.createdAt)}
            </span>
          )}
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700/60 dark:text-zinc-400 flex-shrink-0 mt-0.5">
          <User size={13} strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
