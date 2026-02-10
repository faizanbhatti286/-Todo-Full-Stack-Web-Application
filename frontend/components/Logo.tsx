import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
}) => {
  const sizeStyles = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <svg
          className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'} transition-transform duration-300 group-hover:scale-110`}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill="#3B82F6" />
          <path
            d="M12 20L18 26L28 14"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={`${sizeStyles[size]} font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600`}>
          TaskFlow
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};
