/**
 * @load taskTemplate
 */
INSERT INTO [functional].[taskTemplate]
([name], [templateData], [active])
VALUES
('Daily Standup', '{"title":"Daily Standup Meeting","description":"Team daily sync meeting","priority":1,"estimatedHours":0,"estimatedMinutes":15,"tags":["meeting","daily"]}', 1),
('Code Review', '{"title":"Code Review","description":"Review pull request and provide feedback","priority":1,"estimatedHours":1,"estimatedMinutes":0,"tags":["development","review"]}', 1),
('Bug Fix', '{"title":"Bug Fix","description":"Investigate and fix reported bug","priority":2,"estimatedHours":2,"estimatedMinutes":0,"tags":["bug","development"]}', 1),
('Documentation', '{"title":"Update Documentation","description":"Update project documentation","priority":0,"estimatedHours":1,"estimatedMinutes":30,"tags":["documentation"]}', 1),
('Testing', '{"title":"Write Tests","description":"Write unit and integration tests","priority":1,"estimatedHours":2,"estimatedMinutes":0,"tags":["testing","development"]}', 1);
GO