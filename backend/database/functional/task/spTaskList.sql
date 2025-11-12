/**
 * @summary
 * Retrieves list of tasks for a user with optional filtering by status,
 * priority, and due date. Returns task summary with tag and subtask counts.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier to filter tasks
 *
 * @param {INT} status
 *   - Required: No
 *   - Description: Filter by status (0=Pending, 1=Draft, 2=Completed)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Filter by priority (0=Low, 1=Medium, 2=High)
 *
 * @param {DATE} dueDateFrom
 *   - Required: No
 *   - Description: Filter tasks with due date from this date
 *
 * @param {DATE} dueDateTo
 *   - Required: No
 *   - Description: Filter tasks with due date until this date
 *
 * @testScenarios
 * - List all tasks for user
 * - Filter tasks by status
 * - Filter tasks by priority
 * - Filter tasks by due date range
 * - Combined filters
 * - Empty result set
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER,
  @status INTEGER = NULL,
  @priority INTEGER = NULL,
  @dueDateFrom DATE = NULL,
  @dueDateTo DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @output {TaskList, n, n}
   * @column {INT} idTask - Task identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority
   * @column {INT} status - Task status
   * @column {INT} estimatedHours - Estimated hours
   * @column {INT} estimatedMinutes - Estimated minutes
   * @column {INT} tagCount - Number of tags
   * @column {INT} subtaskCount - Number of subtasks
   * @column {INT} completedSubtaskCount - Number of completed subtasks
   * @column {DATETIME2} dateCreated - Creation date
   * @column {DATETIME2} dateModified - Last modification date
   */
  SELECT
    tsk.[idTask],
    tsk.[title],
    tsk.[description],
    tsk.[dueDate],
    tsk.[priority],
    tsk.[status],
    tsk.[estimatedHours],
    tsk.[estimatedMinutes],
    (
      SELECT COUNT(*)
      FROM [functional].[taskTag] tskTag
      WHERE tskTag.[idAccount] = tsk.[idAccount]
        AND tskTag.[idTask] = tsk.[idTask]
    ) AS [tagCount],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] subTsk
      WHERE subTsk.[idAccount] = tsk.[idAccount]
        AND subTsk.[idTask] = tsk.[idTask]
        AND subTsk.[deleted] = 0
    ) AS [subtaskCount],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] subTsk
      WHERE subTsk.[idAccount] = tsk.[idAccount]
        AND subTsk.[idTask] = tsk.[idTask]
        AND subTsk.[status] = 1
        AND subTsk.[deleted] = 0
    ) AS [completedSubtaskCount],
    tsk.[dateCreated],
    tsk.[dateModified]
  FROM [functional].[task] tsk
  WHERE tsk.[idAccount] = @idAccount
    AND tsk.[idUser] = @idUser
    AND tsk.[deleted] = 0
    AND ((@status IS NULL) OR (tsk.[status] = @status))
    AND ((@priority IS NULL) OR (tsk.[priority] = @priority))
    AND ((@dueDateFrom IS NULL) OR (tsk.[dueDate] >= @dueDateFrom))
    AND ((@dueDateTo IS NULL) OR (tsk.[dueDate] <= @dueDateTo))
  ORDER BY
    tsk.[priority] DESC,
    tsk.[dueDate] ASC,
    tsk.[dateCreated] DESC;
END;
GO