import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = '加载中...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
        {text && <p className="text-sm dark-text-secondary">{text}</p>}
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex flex-col items-center space-y-3 text-center">
        <XCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm dark-text-secondary">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
};

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <p className="text-sm dark-text-secondary">{message}</p>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium dark-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm dark-text-muted mb-4 max-w-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = false 
}) => {
  const baseClasses = 'acg-card-bg rounded-lg shadow-acg';
  const hoverClasses = hover ? 'hover:shadow-acg-lg hover:scale-105 transition-all duration-300' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900';
  
  const variantClasses = {
    primary: 'acg-button-primary text-white hover:shadow-acg-lg focus:ring-primary-500',
    secondary: 'bg-dark-600 text-white hover:bg-dark-500 focus:ring-dark-500',
    outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    ghost: 'text-gray-300 hover:bg-dark-700 hover:text-white focus:ring-primary-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

