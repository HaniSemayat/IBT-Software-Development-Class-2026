using System.Diagnostics;

namespace AddisEats.Api.Middleware;

public sealed class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    public RequestTimingMiddleware(
        RequestDelegate next,
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        // OnCompleted sees the final status, including errors handled
        // by the outer ExceptionHandlingMiddleware.
        context.Response.OnCompleted(() =>
        {
            stopwatch.Stop();

            var elapsedMs = stopwatch.ElapsedMilliseconds;
            var level = elapsedMs > 1000
                ? LogLevel.Warning
                : LogLevel.Information;

            _logger.Log(
                level,
                "{Method} {Path} -> {StatusCode} in {ElapsedMs}ms. CorrelationId: {CorrelationId}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                elapsedMs,
                context.TraceIdentifier);

            return Task.CompletedTask;
        });

        await _next(context);
    }
}
