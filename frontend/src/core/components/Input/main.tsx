import { forwardRef } from 'react';
import { getInputClassName } from './variants';
import type { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, id, ...rest } = props;
  const inputClassName = getInputClassName(!!error);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={label ? 'mt-2' : ''}>
        <input ref={ref} id={id} className={inputClassName} {...rest} />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
