using AddisEats.Api.Errors;
using AddisEats.Api.Middleware;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            JsonNamingPolicy.CamelCase;

        options.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;

        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());

        // Reject unknown JSON properties such as a client-supplied totalEtb.
        options.JsonSerializerOptions.UnmappedMemberHandling =
            JsonUnmappedMemberHandling.Disallow;
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .ToDictionary(
                entry => entry.Key,
                entry => entry.Value!.Errors
                    .Select(error =>
                        string.IsNullOrWhiteSpace(error.ErrorMessage)
                            ? "The supplied value is invalid."
                            : error.ErrorMessage)
                    .ToArray());

        var problem = ApiProblems.Create(
            context.HttpContext,
            StatusCodes.Status400BadRequest,
            "VALIDATION_FAILED",
            "One or more validation errors occurred.",
            "The request contains invalid or missing values.",
            errors);

        return new BadRequestObjectResult(problem);
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// FIRST middleware: catches exceptions from everything registered after it.
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseMiddleware<QueryParameterValidationMiddleware>();

app.UseCors("frontend");
app.UseAuthorization();

// Gives unmatched routes a consistent 404 ProblemDetails response.
// Existing controller ProblemDetails responses are not replaced.
app.UseStatusCodePages(async statusContext =>
{
    var context = statusContext.HttpContext;

    if (context.Response.StatusCode == 404)
    {
        await ApiProblems.WriteAsync(
            context,
            404,
            "ROUTE_NOT_FOUND",
            "Route not found",
            "The requested API route does not exist.");
    }
});

app.MapControllers();

app.Run();
