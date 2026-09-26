import React, { useState } from 'react';
import { MessageSquare, Trash2, Check, X } from 'lucide-react';

export default function ChatHistoryItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  isCollapsed
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDelete(conversation.id);
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      title={isCollapsed ? conversation.title : undefined}
      className={`group relative flex items-center rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer select-none overflow-hidden ${
        isCollapsed
          ? 'h-8 w-8 justify-center mx-auto my-1 p-0'
          : 'h-8 mx-2 mb-0.5 px-2.5 w-[calc(100%-16px)]'
      } ${
        isActive
          ? 'bg-zinc-200/90 text-zinc-900 font-medium border border-zinc-300 dark:bg-zinc-800/80 dark:text-zinc-100 dark:border-zinc-700/50'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
      }`}
    >
      <MessageSquare
        size={14}
        strokeWidth={1.5}
        className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`}
      />

      {/* Title - smoothly collapses without wrapping */}
      <span
        className={`truncate text-xs whitespace-nowrap overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
          isCollapsed
            ? 'max-w-0 opacity-0 ml-0 pointer-events-none'
            : 'max-w-[170px] opacity-100 ml-2 flex-1'
        }`}
      >
        {conversation.title || 'Untitled chat'}
      </span>

      {/* Delete action */}
      {!isCollapsed && (
        isConfirmingDelete ? (
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 px-1 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 animate-fade-in flex-shrink-0 shadow-sm ml-1">
            <button
              onClick={handleConfirmDelete}
              title="Confirm delete"
              aria-label="Confirm delete"
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-0.5 rounded transition"
            >
              <Check size={11} strokeWidth={2} />
            </button>
            <button
              onClick={handleCancelDelete}
              title="Cancel"
              aria-label="Cancel"
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 rounded transition"
            >
              <X size={11} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            title="Delete chat"
            aria-label="Delete chat"
            className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-opacity rounded flex-shrink-0 ml-1"
          >
            <Trash2 size={12} strokeWidth={1.5} />
          </button>
        )
      )}
    </div>
  );
}
