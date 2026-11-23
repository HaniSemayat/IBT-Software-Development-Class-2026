using AddisEats.Api.Errors;

namespace AddisEats.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path}. TraceId: {TraceId}",
                context.Request.Method,
                context.Request.Path,
                context.TraceIdentifier);

            if (context.Response.HasStarted)
                throw;

            context.Response.Clear();

            var (status, code, title, detail) = exception switch
            {
                ArgumentException =>
                    (400, "BAD_ARGUMENT", "Invalid argument",
                        "The supplied argument is invalid."),

                UnauthorizedAccessException =>
                    (403, "FORBIDDEN", "Forbidden",
                        "You are not permitted to perform this action."),

                NotFoundException ex =>
                    (404, ex.Code, "Resource not found", ex.Message),

                PaymentDeclinedException =>
                    (402, "PAYMENT_DECLINED", "Payment declined",
                        "The payment provider declined this payment."),

                GatewayUnreachableException =>
                    (503, "UPSTREAM_DOWN", "Service unavailable",
                        "A required external service is temporarily unavailable."),

                _ =>
                    (500, "INTERNAL_ERROR", "Internal server error",
                        "An unexpected error occurred. Contact support with the trace ID.")
            };

            await ApiProblems.WriteAsync(
                context,
                status,
                code,
                title,
                detail);
        }
    }
}
