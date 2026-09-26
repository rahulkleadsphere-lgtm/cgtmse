import React from 'react';

/**
 * Accessible, reusable icon button with hover feedback and dark/light support
 */
export default function IconButton({
  children,
  onClick,
  title,
  ariaLabel,
  disabled = false,
  className = '',
  size = 'md',
  type = 'button'
}) {
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  }[size] || 'p-2';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title}
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 text-text-secondary hover:text-text-primary hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cgtmse-500 light:text-text-light-secondary light:hover:text-text-light-primary light:hover:bg-light-hover ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
}
