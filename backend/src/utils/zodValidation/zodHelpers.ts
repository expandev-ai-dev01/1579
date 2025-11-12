import { z } from 'zod';

/**
 * @summary
 * Zod schema for BIT fields (0 or 1)
 */
export const zBit = z.number().int().min(0).max(1);

/**
 * @summary
 * Zod schema for date strings
 */
export const zDateString = z.string().datetime();

/**
 * @summary
 * Zod schema for foreign key fields (positive integers)
 */
export const zFK = z.number().int().positive();

/**
 * @summary
 * Zod schema for name fields (1-200 characters)
 */
export const zName = z.string().min(1).max(200);

/**
 * @summary
 * Zod schema for nullable description fields (max 500 characters)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @summary
 * Zod schema for nullable foreign key fields
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * @summary
 * Zod schema for nullable string fields
 */
export const zNullableString = z.string().nullable();

/**
 * @summary
 * Zod schema for required string fields
 */
export const zString = z.string().min(1);
