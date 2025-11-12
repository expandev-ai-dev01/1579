import { forwardRef } from 'react';
import { getButtonClassName } from './variants';
import type { ButtonProps } from './types';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size, fullWidth, className, children, isLoading, disabled, ...rest } = props;
  const buttonClassName = getButtonClassName({ variant, size, fullWidth });

  return (
    <button
      ref={ref}
      className={`${buttonClassName} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <LoadingSpinner size="small" /> : children}
    </button>
  );
});

Button.displayName = 'Button';
