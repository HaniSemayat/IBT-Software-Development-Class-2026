using AddisEats.Api.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/delivery")]
public class DeliveryController : ControllerBase
{
    private readonly DeliveryOptions _options;

    public DeliveryController(IOptions<DeliveryOptions> options)
    {
        _options = options.Value;
    }

    [HttpGet("settings")]
    public IActionResult GetSettings()
    {
        return Ok(new
        {
            _options.FreeAboveEtb,
            _options.DefaultFeeEtb
        });
    }
}
