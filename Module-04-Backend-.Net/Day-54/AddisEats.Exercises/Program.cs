using AddisEats.Api.Authentication;
using AddisEats.Api.Options;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IClock, AddisEats.Api.Services.SystemClock>();
builder.Services.AddScoped<IPaymentProvider, TeleBirrProvider>();

builder.Services.Configure<DeliveryOptions>(
    builder.Configuration.GetSection("Delivery"));

builder.Services
    .AddAuthentication("Demo")
    .AddScheme<AuthenticationSchemeOptions, DemoAuthHandler>("Demo", _ => { });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();