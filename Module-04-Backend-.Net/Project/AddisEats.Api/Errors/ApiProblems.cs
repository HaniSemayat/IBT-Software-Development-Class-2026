using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Errors;

public static class ApiProblems
{
    public static ProblemDetails Create(
        HttpContext context,
        int status,
        string code,
        string title,
        string detail,
        Dictionary<string, string[]>? errors = null)
    {
        var problem = new ProblemDetails
        {
            Type = $"https://addiseats.et/errors/{code.ToLowerInvariant()}",
            Title = title,
            Status = status,
            Detail = detail,
            Instance = context.Request.Path
        };

        problem.Extensions["code"] = code;

        if (errors is not null && errors.Count > 0)
            problem.Extensions["errors"] = errors;

        return problem;
    }

    public static ObjectResult Result(
        HttpContext context,
        int status,
        string code,
        string title,
        string detail,
        Dictionary<string, string[]>? errors = null)
    {
        return new ObjectResult(
            Create(context, status, code, title, detail, errors))
        {
            StatusCode = status
        };
    }

    public static async Task WriteAsync(
        HttpContext context,
        int status,
        string code,
        string title,
        string detail)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";

        var problem = Create(context, status, code, title, detail);

        await System.Text.Json.JsonSerializer.SerializeAsync(
            context.Response.Body,
            problem,
            new System.Text.Json.JsonSerializerOptions(
                System.Text.Json.JsonSerializerDefaults.Web));
    }
}
