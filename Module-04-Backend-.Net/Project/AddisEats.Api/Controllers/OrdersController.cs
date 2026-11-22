using AddisEats.Api.Models;
using AddisEats.Api.Models.Dtos;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<OrderDto> GetOne(int id)
    {
        var order = _orderService.GetById(id);

        if (order is null)
            return NotFound(new { message = $"Order {id} was not found." });

        return order.ToDto();
    }

    [HttpPost]
    public ActionResult<OrderDto> Create(
        [FromBody] CreateOrderRequest req)
    {
        var order = _orderService.Create(req);

        return CreatedAtAction(
            nameof(GetOne),
            new { id = order.Id },
            order.ToDto()
        );
    }

    [HttpPatch("{id:int:min(1)}/status")]
    [HttpPatch("{id:int:min(1)}/status")]
    public ActionResult<OrderDto> UpdateStatus(
        int id,
        [FromBody] UpdateOrderStatusRequest request)
    {
        var order = _orderService.UpdateStatus(id, request.Status);

        if (order is null)
            return NotFound(new { message = $"Order {id} was not found." });

        return order.ToDto();
    }
}
