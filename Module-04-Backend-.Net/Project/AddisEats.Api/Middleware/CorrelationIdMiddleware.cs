namespace AddisEats.Api.Middleware;

public sealed class CorrelationIdMiddleware
{
    private const string HeaderName = "X-Correlation-Id";

    private readonly RequestDelegate _next;
    private readonly ILogger<CorrelationIdMiddleware> _logger;

    public CorrelationIdMiddleware(
        RequestDelegate next,
        ILogger<CorrelationIdMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var incomingId = context.Request.Headers[HeaderName].FirstOrDefault();

        // Accept only short, safe identifiers supplied by the caller.
        var isValid = !string.IsNullOrWhiteSpace(incomingId)
            && incomingId.Length <= 128
            && incomingId.All(c =>
                char.IsAsciiLetterOrDigit(c) || c is '-' or '_' or '.');

        var correlationId = isValid
            ? incomingId!
            : Guid.NewGuid().ToString("N");

        context.TraceIdentifier = correlationId;
        context.Response.Headers[HeaderName] = correlationId;

        using (_logger.BeginScope(
            new Dictionary<string, object>
            {
                ["CorrelationId"] = correlationId
            }))
        {
            await _next(context);
        }
    }
}
