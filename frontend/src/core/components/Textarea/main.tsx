import { forwardRef } from 'react';
import { getTextareaClassName } from './variants';
import type { TextareaProps } from './types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { label, error, id, ...rest } = props;
  const textareaClassName = getTextareaClassName(!!error);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={label ? 'mt-2' : ''}>
        <textarea ref={ref} id={id} className={textareaClassName} {...rest} />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
