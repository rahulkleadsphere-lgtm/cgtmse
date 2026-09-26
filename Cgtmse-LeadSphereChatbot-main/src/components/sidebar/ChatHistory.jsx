import React, { useState, useMemo } from 'react';
import { Search, X, MessageSquare } from 'lucide-react';
import ChatHistoryItem from './ChatHistoryItem';
import { groupConversationsByDate } from '../../utils/formatDate';
import { searchConversations } from '../../utils/conversations';

export default function ChatHistory({
  conversations,
  activeConvId,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return searchConversations(conversations, searchQuery);
  }, [conversations, searchQuery]);

  // Group by date
  const grouped = useMemo(() => {
    return groupConversationsByDate(filteredConversations);
  }, [filteredConversations]);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Search Input (Smoothly slides up/down) */}
      <div 
        className={`px-3 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isCollapsed 
            ? 'max-h-0 opacity-0 pb-0 pt-0 pointer-events-none' 
            : 'max-h-12 opacity-100 pb-2 pt-1'
        }`}
      >
        <div className="relative flex items-center">
          <Search size={13} strokeWidth={1.6} className="absolute left-2.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-lg bg-white py-1.5 pl-8 pr-7 text-xs text-zinc-800 placeholder:text-zinc-400 border border-zinc-300 focus:outline-none focus:border-blue-500 dark:bg-zinc-900/60 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:border-zinc-800/80 dark:focus:border-zinc-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 rounded"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {conversations.length === 0 ? (
          <div 
            className={`px-4 py-8 text-center select-none overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
              isCollapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-36 opacity-100'
            }`}
          >
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200/60 border border-zinc-300 text-zinc-500 dark:bg-zinc-900/60 dark:border-zinc-800/70 dark:text-zinc-600">
              <MessageSquare size={14} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">No chat history</p>
            <p className="text-[11px] mt-0.5 text-zinc-500 dark:text-zinc-500">
              Start by asking a question.
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div 
            className={`px-4 py-8 text-center text-xs text-zinc-500 overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-24 opacity-100'
            }`}
          >
            <p>No chats found</p>
            <p className="text-[11px] mt-0.5 text-zinc-400 dark:text-zinc-600">
              Try a different keyword.
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.title} className="mb-2">
              <div 
                className={`px-4 text-[10px] font-semibold text-zinc-500 dark:text-zinc-500 tracking-wider uppercase overflow-hidden whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                  isCollapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-6 opacity-100 py-1'
                }`}
              >
                {group.title}
              </div>
              {group.items.map((conv) => (
                <ChatHistoryItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConvId}
                  onSelect={onSelectConversation}
                  onDelete={onDeleteConversation}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
