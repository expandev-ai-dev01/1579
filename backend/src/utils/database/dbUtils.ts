import sql, { IRecordSet } from 'mssql';
import { getPool } from '@/instances/database';

export enum ExpectedReturn {
  Single,
  Multi,
  None,
}

/**
 * @summary
 * Executes a stored procedure against the database.
 *
 * @function dbRequest
 * @module utils/database
 *
 * @param {string} routine - The name of the stored procedure to execute.
 * @param {object} parameters - An object containing the parameters for the procedure.
 * @param {ExpectedReturn} expectedReturn - The expected return type from the procedure.
 * @param {sql.Transaction} [transaction] - An optional transaction to run the request in.
 * @param {string[]} [resultSetNames] - Optional names for multiple result sets.
 *
 * @returns {Promise<any>} The result from the database operation.
 */
export async function dbRequest(
  routine: string,
  parameters: object,
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const pool = await getPool();
  const request = transaction ? transaction.request() : pool.request();

  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  const result = await request.execute(routine);

  switch (expectedReturn) {
    case ExpectedReturn.Single:
      return result.recordset?.[0] || null;

    case ExpectedReturn.Multi:
      if (resultSetNames && resultSetNames.length > 0) {
        const namedResultSets: { [key: string]: IRecordSet<any> } = {};
        const recordsetsArray = result.recordsets as IRecordSet<any>[];
        for (let i = 0; i < resultSetNames.length; i++) {
          namedResultSets[resultSetNames[i]] = recordsetsArray[i];
        }
        return namedResultSets;
      }
      return result.recordsets as IRecordSet<any>[];

    case ExpectedReturn.None:
    default:
      return;
  }
}
