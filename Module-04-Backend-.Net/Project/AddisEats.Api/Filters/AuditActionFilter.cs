using Microsoft.AspNetCore.Mvc.Filters;

namespace AddisEats.Api.Filters;

public sealed class AuditActionFilter : IActionFilter
{
    private readonly ILogger<AuditActionFilter> _logger;

    public AuditActionFilter(ILogger<AuditActionFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var actionName = context.ActionDescriptor.DisplayName;

        _logger.LogInformation(
            "Executing MVC action {ActionName}. Bound arguments: {@Arguments}",
            actionName,
            context.ActionArguments);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation(
            "Finished MVC action {ActionName}. Exception: {HasException}",
            context.ActionDescriptor.DisplayName,
            context.Exception is not null && !context.ExceptionHandled);
    }
}
