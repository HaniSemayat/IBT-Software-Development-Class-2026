using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    private readonly IClock _clock;
    private readonly IWebHostEnvironment _environment;

    public HealthController(IClock clock, IWebHostEnvironment environment)
    {
        _clock = clock;
        _environment = environment;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            UtcTime = _clock.UtcNow,
            Environment = _environment.EnvironmentName
        });
    }
}
