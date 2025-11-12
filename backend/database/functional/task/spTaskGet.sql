/**
 * @summary
 * Retrieves complete task details including tags, attachments, and subtasks.
 * Returns multiple result sets for efficient data retrieval.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to retrieve
 *
 * @testScenarios
 * - Get existing task with all details
 * - Get task with no tags or subtasks
 * - Get non-existent task
 * - Get task from different account (security)
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Task existence validation
   * @throw {taskNotFound}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[task] tsk
    WHERE tsk.[idTask] = @idTask
      AND tsk.[idAccount] = @idAccount
      AND tsk.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskNotFound', 1;
  END;

  /**
   * @output {TaskDetails, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority
   * @column {INT} status - Task status
   * @column {NVARCHAR} recurrenceConfig - Recurrence configuration JSON
   * @column {INT} estimatedHours - Estimated hours
   * @column {INT} estimatedMinutes - Estimated minutes
   * @column {DATETIME2} dateCreated - Creation date
   * @column {DATETIME2} dateModified - Last modification date
   */
  SELECT
    tsk.[idTask],
    tsk.[idUser],
    tsk.[title],
    tsk.[description],
    tsk.[dueDate],
    tsk.[priority],
    tsk.[status],
    tsk.[recurrenceConfig],
    tsk.[estimatedHours],
    tsk.[estimatedMinutes],
    tsk.[dateCreated],
    tsk.[dateModified]
  FROM [functional].[task] tsk
  WHERE tsk.[idTask] = @idTask
    AND tsk.[idAccount] = @idAccount
    AND tsk.[deleted] = 0;

  /**
   * @output {TaskTags, n, n}
   * @column {NVARCHAR} tag - Tag name
   */
  SELECT
    tskTag.[tag]
  FROM [functional].[taskTag] tskTag
  WHERE tskTag.[idTask] = @idTask
    AND tskTag.[idAccount] = @idAccount
  ORDER BY
    tskTag.[tag];

  /**
   * @output {TaskAttachments, n, n}
   * @column {INT} idAttachment - Attachment identifier
   * @column {NVARCHAR} fileName - File name
   * @column {INT} fileSize - File size in bytes
   * @column {VARCHAR} fileType - File MIME type
   * @column {NVARCHAR} filePath - File storage path
   * @column {DATETIME2} dateCreated - Upload date
   */
  SELECT
    tskAtt.[idAttachment],
    tskAtt.[fileName],
    tskAtt.[fileSize],
    tskAtt.[fileType],
    tskAtt.[filePath],
    tskAtt.[dateCreated]
  FROM [functional].[taskAttachment] tskAtt
  WHERE tskAtt.[idTask] = @idTask
    AND tskAtt.[idAccount] = @idAccount
  ORDER BY
    tskAtt.[dateCreated];

  /**
   * @output {TaskSubtasks, n, n}
   * @column {INT} idSubtask - Subtask identifier
   * @column {NVARCHAR} title - Subtask title
   * @column {INT} status - Subtask status
   * @column {INT} sortOrder - Display order
   * @column {DATETIME2} dateCreated - Creation date
   */
  SELECT
    subTsk.[idSubtask],
    subTsk.[title],
    subTsk.[status],
    subTsk.[sortOrder],
    subTsk.[dateCreated]
  FROM [functional].[subtask] subTsk
  WHERE subTsk.[idTask] = @idTask
    AND subTsk.[idAccount] = @idAccount
    AND subTsk.[deleted] = 0
  ORDER BY
    subTsk.[sortOrder];
END;
GO