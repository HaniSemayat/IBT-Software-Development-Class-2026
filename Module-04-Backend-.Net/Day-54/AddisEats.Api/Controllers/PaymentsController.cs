using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentProvider _paymentProvider;

    public PaymentsController(IPaymentProvider paymentProvider)
    {
        _paymentProvider = paymentProvider;
    }

    [HttpGet("provider")]
    public IActionResult GetProvider()
    {
        return Ok(new { Provider = _paymentProvider.ProviderName });
    }
}
