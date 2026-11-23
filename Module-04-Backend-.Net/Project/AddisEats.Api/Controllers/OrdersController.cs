using AddisEats.Api.Common;
using AddisEats.Api.Errors;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Dtos;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders)
    {
        _orders = orders;
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<OrderDto> GetOne(int id)
    {
        var result = _orders.GetById(id);

        if (!result.IsSuccess)
            return ApiProblems.Result(HttpContext, result.Error!);

        return Ok(result.Value!.ToDto());
    }

    [HttpPost]
    public ActionResult<OrderDto> Create(
        [FromBody] CreateOrderRequest request)
    {
        var result = _orders.Place(request);

        if (!result.IsSuccess)
            return ApiProblems.Result(HttpContext, result.Error!);

        var order = result.Value!;

        return CreatedAtAction(
            nameof(GetOne),
            new { id = order.Id },
            order.ToDto());
    }

    [HttpPatch("{id:int:min(1)}/status")]
    public IActionResult UpdateStatus(
        int id,
        [FromBody] UpdateOrderStatusRequest request)
    {
        if (!Enum.TryParse<OrderStatus>(
                request.Status,
                ignoreCase: false,
                out var status))
        {
            return ApiProblems.Result(
                HttpContext,
                400,
                "VALIDATION_FAILED",
                "Invalid order status",
                "Choose a supported order status.");
        }

        var result = _orders.UpdateStatus(id, status);

        if (!result.IsSuccess)
            return ApiProblems.Result(HttpContext, result.Error!);

        return NoContent();
    }
}
