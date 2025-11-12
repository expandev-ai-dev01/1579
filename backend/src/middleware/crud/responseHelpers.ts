/**
 * @summary
 * Helper function to create success response
 *
 * @function successResponse
 * @param {any} data - Response data
 * @param {any} metadata - Optional metadata
 *
 * @returns {object} Success response object
 */
export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    ...(metadata && { metadata: { ...metadata, timestamp: new Date().toISOString() } }),
  };
}

/**
 * @summary
 * Helper function to create error response
 *
 * @function errorResponse
 * @param {string} message - Error message
 * @param {string} code - Error code
 *
 * @returns {object} Error response object
 */
export function errorResponse(message: string, code: string = 'ERROR') {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * @constant StatusGeneralError
 * @description General error object for unexpected errors
 */
export const StatusGeneralError = new Error('An unexpected error occurred');
