using AddisEats.Api.Errors;

namespace AddisEats.Api.Middleware;

public class QueryParameterValidationMiddleware
{
    private readonly RequestDelegate _next;

    private static readonly HashSet<string> RestaurantQueryParameters =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "area",
            "areas",
            "maxFeeEtb",
            "page",
            "limit",
            "sort"
        };

    public QueryParameterValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Query.Count > 0)
        {
            var path = context.Request.Path.Value ?? "";

            var allowed = HttpMethods.IsGet(context.Request.Method)
                && path.Equals(
                    "/api/v1/restaurants",
                    StringComparison.OrdinalIgnoreCase)
                ? RestaurantQueryParameters
                : new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            var unknown = context.Request.Query.Keys
                .Where(key => !allowed.Contains(key))
                .ToList();

            if (unknown.Count > 0)
            {
                await ApiProblems.WriteAsync(
                    context,
                    StatusCodes.Status400BadRequest,
                    "UNKNOWN_QUERY_PARAMETER",
                    "Unknown query parameter",
                    $"Unsupported query parameter(s): {string.Join(", ", unknown)}.");

                return;
            }
        }

        await _next(context);
    }
}
