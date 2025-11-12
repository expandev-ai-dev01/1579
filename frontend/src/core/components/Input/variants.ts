import { clsx } from 'clsx';

export function getInputClassName(error?: boolean): string {
  return clsx(
    'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
    {
      'ring-red-500 focus:ring-red-500': error,
      'focus:ring-blue-600': !error,
    }
  );
}
