/**
 * @summary
 * Retrieves list of available task templates for quick task creation.
 *
 * @procedure spTaskTemplateList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task-template
 *
 * @parameters
 * None - Returns all active templates
 *
 * @testScenarios
 * - List all active templates
 * - Verify template data structure
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskTemplateList]
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @output {TemplateList, n, n}
   * @column {INT} idTemplate - Template identifier
   * @column {NVARCHAR} name - Template name
   * @column {NVARCHAR} templateData - Template configuration JSON
   */
  SELECT
    tskTpl.[idTemplate],
    tskTpl.[name],
    tskTpl.[templateData]
  FROM [functional].[taskTemplate] tskTpl
  WHERE tskTpl.[active] = 1
  ORDER BY
    tskTpl.[name];
END;
GO