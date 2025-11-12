/**
 * @summary
 * Creates a new task with all specified attributes including optional recurrence,
 * tags, attachments, estimated time, and subtasks. Validates all business rules
 * and ensures data integrity.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (must be today or future)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Task priority (0=Low, 1=Medium, 2=High)
 *
 * @param {INT} status
 *   - Required: No
 *   - Description: Task status (0=Pending, 1=Draft, 2=Completed)
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON configuration for recurring tasks
 *
 * @param {INT} estimatedHours
 *   - Required: No
 *   - Description: Estimated hours for completion (0-999)
 *
 * @param {INT} estimatedMinutes
 *   - Required: No
 *   - Description: Estimated minutes for completion (0-59)
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: JSON array of tags (max 5 tags, 2-20 chars each)
 *
 * @param {NVARCHAR(MAX)} subtasks
 *   - Required: No
 *   - Description: JSON array of subtask titles (max 20 subtasks)
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid task creation with only required fields
 * - Valid task creation with all optional fields
 * - Task creation with recurrence configuration
 * - Task creation with tags and subtasks
 * - Validation failure for title length
 * - Validation failure for past due date
 * - Validation failure for invalid priority
 * - Validation failure for too many tags
 * - Validation failure for too many subtasks
 * - Business rule validation for active task limit
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = '',
  @dueDate DATE = NULL,
  @priority INTEGER = 1,
  @status INTEGER = 0,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @estimatedHours INTEGER = NULL,
  @estimatedMinutes INTEGER = NULL,
  @tags NVARCHAR(MAX) = NULL,
  @subtasks NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idTask INTEGER;
  DECLARE @activeTaskCount INTEGER;
  DECLARE @tagCount INTEGER;
  DECLARE @subtaskCount INTEGER;

  BEGIN TRY
    /**
     * @validation Required parameter validation
     * @throw {titleRequired}
     */
    IF (@title IS NULL) OR (LTRIM(RTRIM(@title)) = '')
    BEGIN
      ;THROW 51000, 'titleRequired', 1;
    END;

    /**
     * @validation Title length validation
     * @throw {titleTooShort}
     * @throw {titleTooLong}
     */
    IF (LEN(LTRIM(RTRIM(@title))) < 3)
    BEGIN
      ;THROW 51000, 'titleTooShort', 1;
    END;

    IF (LEN(@title) > 100)
    BEGIN
      ;THROW 51000, 'titleTooLong', 1;
    END;

    /**
     * @validation Description length validation
     * @throw {descriptionTooLong}
     */
    IF (@description IS NOT NULL) AND (LEN(@description) > 1000)
    BEGIN
      ;THROW 51000, 'descriptionTooLong', 1;
    END;

    /**
     * @validation Due date validation
     * @throw {dueDateInPast}
     */
    IF (@dueDate IS NOT NULL) AND (@dueDate < CAST(GETUTCDATE() AS DATE))
    BEGIN
      ;THROW 51000, 'dueDateInPast', 1;
    END;

    /**
     * @validation Priority validation
     * @throw {invalidPriority}
     */
    IF (@priority < 0) OR (@priority > 2)
    BEGIN
      ;THROW 51000, 'invalidPriority', 1;
    END;

    /**
     * @validation Status validation
     * @throw {invalidStatus}
     */
    IF (@status < 0) OR (@status > 2)
    BEGIN
      ;THROW 51000, 'invalidStatus', 1;
    END;

    /**
     * @validation Estimated time validation
     * @throw {invalidEstimatedHours}
     * @throw {invalidEstimatedMinutes}
     */
    IF (@estimatedHours IS NOT NULL) AND ((@estimatedHours < 0) OR (@estimatedHours > 999))
    BEGIN
      ;THROW 51000, 'invalidEstimatedHours', 1;
    END;

    IF (@estimatedMinutes IS NOT NULL) AND ((@estimatedMinutes < 0) OR (@estimatedMinutes > 59))
    BEGIN
      ;THROW 51000, 'invalidEstimatedMinutes', 1;
    END;

    /**
     * @validation Tags validation
     * @throw {tooManyTags}
     */
    IF (@tags IS NOT NULL)
    BEGIN
      SET @tagCount = (SELECT COUNT(*) FROM OPENJSON(@tags));
      IF (@tagCount > 5)
      BEGIN
        ;THROW 51000, 'tooManyTags', 1;
      END;
    END;

    /**
     * @validation Subtasks validation
     * @throw {tooManySubtasks}
     */
    IF (@subtasks IS NOT NULL)
    BEGIN
      SET @subtaskCount = (SELECT COUNT(*) FROM OPENJSON(@subtasks));
      IF (@subtaskCount > 20)
      BEGIN
        ;THROW 51000, 'tooManySubtasks', 1;
      END;
    END;

    /**
     * @rule {BR-005} Active task limit validation
     * @throw {activeTaskLimitReached}
     */
    SELECT @activeTaskCount = COUNT(*)
    FROM [functional].[task] tsk
    WHERE tsk.[idAccount] = @idAccount
      AND tsk.[idUser] = @idUser
      AND tsk.[deleted] = 0
      AND tsk.[status] <> 2;

    IF (@activeTaskCount >= 1000)
    BEGIN
      ;THROW 51000, 'activeTaskLimitReached', 1;
    END;

    /**
     * @rule {db-transaction-control} Begin transaction for multi-table insert
     */
    BEGIN TRAN;

      /**
       * @rule {BR-001,BR-002} Insert main task record
       */
      INSERT INTO [functional].[task]
      ([idAccount], [idUser], [title], [description], [dueDate], [priority], [status],
       [recurrenceConfig], [estimatedHours], [estimatedMinutes], [dateCreated], [dateModified])
      VALUES
      (@idAccount, @idUser, @title, @description, @dueDate, @priority, @status,
       @recurrenceConfig, @estimatedHours, @estimatedMinutes, GETUTCDATE(), GETUTCDATE());

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @rule {RU-014,RU-015} Insert task tags if provided
       */
      IF (@tags IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskTag]
        ([idAccount], [idTask], [tag])
        SELECT
          @idAccount,
          @idTask,
          [value]
        FROM OPENJSON(@tags)
        WHERE (LEN([value]) >= 2) AND (LEN([value]) <= 20);
      END;

      /**
       * @rule {BR-009,BR-010} Insert subtasks if provided
       */
      IF (@subtasks IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[subtask]
        ([idAccount], [idTask], [title], [sortOrder], [dateCreated])
        SELECT
          @idAccount,
          @idTask,
          [value],
          ROW_NUMBER() OVER (ORDER BY (SELECT NULL)),
          GETUTCDATE()
        FROM OPENJSON(@subtasks)
        WHERE (LEN([value]) >= 3) AND (LEN([value]) <= 100);
      END;

    COMMIT TRAN;

    /**
     * @output {TaskCreated, 1, 1}
     * @column {INT} idTask - Created task identifier
     */
    SELECT @idTask AS [idTask];

  END TRY
  BEGIN CATCH
    IF (@@TRANCOUNT > 0)
    BEGIN
      ROLLBACK TRAN;
    END;

    THROW;
  END CATCH;
END;
GO