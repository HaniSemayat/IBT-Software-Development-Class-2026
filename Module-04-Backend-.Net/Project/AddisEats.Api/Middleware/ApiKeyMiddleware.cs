using System.Security.Cryptography;
using System.Text;

namespace AddisEats.Api.Middleware;

public sealed class ApiKeyMiddleware
{
    private const string HeaderName = "X-Api-Key";
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public ApiKeyMiddleware(
        RequestDelegate next,
        IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var expectedKey =
            _configuration["Day59:AdminApiKey"] ?? "day59-demo-key";

        var suppliedKey = context.Request.Headers[HeaderName].FirstOrDefault();

        var suppliedBytes = Encoding.UTF8.GetBytes(suppliedKey ?? "");
        var expectedBytes = Encoding.UTF8.GetBytes(expectedKey);

        var valid = suppliedBytes.Length == expectedBytes.Length
            && CryptographicOperations.FixedTimeEquals(
                suppliedBytes,
                expectedBytes);

        if (!valid)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                code = "API_KEY_REQUIRED",
                message = "A valid X-Api-Key header is required."
            });

            return; // Short-circuit: the next component never runs.
        }

        await _next(context);
    }
}
