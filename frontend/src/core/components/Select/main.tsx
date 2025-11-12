import { forwardRef } from 'react';
import { getSelectClassName } from './variants';
import type { SelectProps } from './types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { label, error, id, options, ...rest } = props;
  const selectClassName = getSelectClassName(!!error);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={label ? 'mt-2' : ''}>
        <select ref={ref} id={id} className={selectClassName} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
