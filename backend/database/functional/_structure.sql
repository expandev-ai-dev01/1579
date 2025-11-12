/**
 * @schema functional
 * Business logic schema for TODO list application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Main task entity for TODO list
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NOT NULL DEFAULT (''),
  [dueDate] DATE NULL,
  [priority] INTEGER NOT NULL DEFAULT (1),
  [status] INTEGER NOT NULL DEFAULT (0),
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [estimatedHours] INTEGER NULL,
  [estimatedMinutes] INTEGER NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTag Task tags for categorization
 * @multitenancy true
 * @softDelete false
 * @alias tskTag
 */
CREATE TABLE [functional].[taskTag] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [tag] NVARCHAR(20) NOT NULL
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete false
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table subtask Subtasks for task breakdown
 * @multitenancy true
 * @softDelete true
 * @alias subTsk
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [status] INTEGER NOT NULL DEFAULT (0),
  [sortOrder] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTemplate Predefined task templates
 * @multitenancy false
 * @softDelete false
 * @alias tskTpl
 */
CREATE TABLE [functional].[taskTemplate] (
  [idTemplate] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [templateData] NVARCHAR(MAX) NOT NULL,
  [active] BIT NOT NULL DEFAULT (1)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskTag
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [pkTaskTag] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [tag]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idAttachment]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkTaskTemplate
 * @keyType Object
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [pkTaskTemplate] PRIMARY KEY CLUSTERED ([idTemplate]);
GO

/**
 * @foreignKey fkTask_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTask_User
 * @target security.user
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @foreignKey fkTaskTag_Task
 * @target functional.task
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [fkTaskTag_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskAttachment_Task
 * @target functional.task
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [fkTaskAttachment_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkSubtask_Task
 * @target functional.task
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @check chkTask_Priority
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status
 * @enum {0} Pending
 * @enum {1} Draft
 * @enum {2} Completed
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @check chkSubtask_Status
 * @enum {0} Pending
 * @enum {1} Completed
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [chkSubtask_Status] CHECK ([status] BETWEEN 0 AND 1);
GO

/**
 * @index ixTask_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
INCLUDE ([title], [dueDate], [priority], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [dueDate], [priority])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0 AND [dueDate] IS NOT NULL;
GO

/**
 * @index ixTaskTag_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTag_Account_Task]
ON [functional].[taskTag]([idAccount], [idTask]);
GO

/**
 * @index ixTaskAttachment_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account_Task]
ON [functional].[taskAttachment]([idAccount], [idTask]);
GO

/**
 * @index ixSubtask_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account_Task]
ON [functional].[subtask]([idAccount], [idTask])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Active
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Active]
ON [functional].[taskTemplate]([active])
WHERE [active] = 1;
GO