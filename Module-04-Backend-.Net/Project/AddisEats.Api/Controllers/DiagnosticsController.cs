using AddisEats.Api.Errors;
using AddisEats.Api.Validation;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Controllers;

// Development-only endpoint for verifying exception mappings.
// It is not included in Swagger and returns 404 outside Development.
[ApiController]
[Route("api/v1/dev/errors")]
[ApiExplorerSettings(IgnoreApi = true)]
public sealed class DiagnosticsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public DiagnosticsController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet("{kind}")]
    public IActionResult Throw(string kind)
    {
        if (!_environment.IsDevelopment())
            return NotFound();

        switch (kind.ToLowerInvariant())
        {
            case "payment":
                throw new PaymentDeclinedException(
                    "Private payment provider details.");

            case "gateway":
                throw new GatewayUnreachableException(
                    "Private gateway connection details.");

            case "unexpected":
                throw new InvalidOperationException(
                    "Sensitive database table and connection details.");

            case "argument":
                throw new ArgumentException(
                    "Private argument details.");

            case "forbidden":
                throw new UnauthorizedAccessException(
                    "Private authorization details.");

            case "not-found":
                throw new NotFoundException(
                    "DIAGNOSTIC_NOT_FOUND",
                    "The diagnostic resource was not found.");

            default:
                return BadRequest(new
                {
                    message = "Use payment, gateway, unexpected, argument, forbidden, or not-found."
                });
        }
    }
}

// A small validation model used by the Day 58 ETB attribute exercise.
// It is not an order request and cannot change an order total.
public sealed class EtbAmountValidationSample
{
    [EtbAmount]
    public decimal Amount { get; set; }
}
