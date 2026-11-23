using AddisEats.Api.Errors;
using AddisEats.Api.Filters;
using AddisEats.Api.Middleware;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// MVC controllers and the global audit action filter.
builder.Services.AddScoped<AuditActionFilter>();

builder.Services
    .AddControllers(options =>
    {
        options.Filters.AddService<AuditActionFilter>();
    })
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

// 1. Outermost: catches exceptions from all downstream middleware.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 2. Assign the correlation ID before downstream logging begins.
app.UseMiddleware<CorrelationIdMiddleware>();

// 3. Measures the complete downstream request and final response.
app.UseMiddleware<RequestTimingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 4. Select the endpoint before endpoint-aware middleware.
app.UseRouting();

// 5. CORS must run after routing and before authorization.
app.UseCors("frontend");

// Existing Day 58 query validation middleware.
app.UseMiddleware<QueryParameterValidationMiddleware>();

// Future Day 63: register AddRateLimiter before enabling this.
// app.UseRateLimiter();

// Future Day 61: register authentication services first.
// app.UseAuthentication();

// Future Day 62:
app.UseAuthorization();

// Consistent ProblemDetails response for unmatched routes.
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

// Day 59 demonstration branch.
// /admin is handled here and does not continue to MVC controllers.
app.Map("/admin", admin =>
{
    admin.UseMiddleware<ApiKeyMiddleware>();

    admin.Run(async context =>
    {
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync("Admin branch reached.");
    });
});

// Controllers are the final endpoint execution stage.
app.MapControllers();

app.Run();

