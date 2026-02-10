import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'bordered';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg p-6 transition-all duration-200';

  const variantStyles = {
    default: 'shadow-md',
    hover: 'shadow-md hover:shadow-xl hover:scale-105 cursor-pointer',
    bordered: 'border border-gray-200 hover:border-gray-300',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
