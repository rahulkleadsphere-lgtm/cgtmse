import React from 'react';

/**
 * CGTMSE Assist - Institutional Emblem
 * Professional, clean geometric mark representing trust, credit guarantee, and MSME growth.
 */
export default function Logo({ size = 32, className = '' }) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700/50 select-none flex-shrink-0 shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.62, height: size * 0.62 }}
        className="text-zinc-200"
      >
        {/* Institutional shield frame */}
        <path
          d="M12 2.5L4 6v6.5c0 5 3.5 9.2 8 10.5 4.5-1.3 8-5.5 8-10.5V6l-8-3.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central pillar / growth chevron */}
        <path
          d="M12 7.5v8.5"
          stroke="#3B82F6"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 11.5L12 8l3.5 3.5"
          stroke="#60A5FA"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stable base line */}
        <path
          d="M9 16h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
