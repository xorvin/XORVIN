import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold font-inter text-white bg-red-600 hover:bg-red-500 transition-all duration-300',
  accent:    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold font-inter transition-all duration-300 bg-gradient-to-r from-xorvin-accent to-xorvin-primary text-xorvin-dark hover:shadow-glow-accent hover:-translate-y-0.5',
};

const sizeClasses = {
  sm: '!px-4 !py-2 !text-sm',
  md: '',
  lg: '!px-8 !py-4 !text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon,
  children, className, disabled, ...props
}, ref) => (
  <button
    ref={ref}
    className={cn(variantClasses[variant], sizeClasses[size], className)}
    disabled={disabled || isLoading}
    aria-disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
));
Button.displayName = 'Button';
