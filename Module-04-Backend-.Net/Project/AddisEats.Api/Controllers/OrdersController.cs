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
    private readonly IOrderService _orderService;
    private readonly IRestaurantService _restaurantService;

    public OrdersController(
        IOrderService orderService,
        IRestaurantService restaurantService)
    {
        _orderService = orderService;
        _restaurantService = restaurantService;
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<OrderDto> GetOne(int id)
    {
        var order = _orderService.GetById(id);

        if (order is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "ORDER_NOT_FOUND",
                "Order not found",
                $"Order {id} was not found.");
        }

        return Ok(order.ToDto());
    }

    [HttpPost]
    public ActionResult<OrderDto> Create(
        [FromBody] CreateOrderRequest req)
    {
        if (req.RestaurantId < 1)
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Invalid restaurant ID",
                "RestaurantId must be a positive integer.");
        }

        if (string.IsNullOrWhiteSpace(req.Area))
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Area is required",
                "Provide the delivery area.");
        }

        if (req.Qty < 1)
        {
            return ApiProblems.Result(
                HttpContext, 422, "VALIDATION_FAILED",
                "Invalid quantity",
                "Quantity must be at least 1.");
        }

        if (_restaurantService.GetById(req.RestaurantId) is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "RESTAURANT_NOT_FOUND",
                "Restaurant not found",
                $"Restaurant {req.RestaurantId} was not found.");
        }

        var order = _orderService.Create(req);

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
        var existing = _orderService.GetById(id);

        if (existing is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "ORDER_NOT_FOUND",
                "Order not found",
                $"Order {id} was not found.");
        }

        if (!Enum.IsDefined(typeof(OrderStatus), request.Status))
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Invalid order status",
                "The supplied order status is not supported.");
        }

        if (existing.Status == OrderStatus.Delivered
            && request.Status == OrderStatus.Cancelled)
        {
            return ApiProblems.Result(
                HttpContext, 409, "ORDER_ALREADY_DELIVERED",
                "Order cannot be cancelled",
                "A delivered order cannot be cancelled.");
        }

        var updated = _orderService.UpdateStatus(id, request.Status);

        if (updated is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "ORDER_NOT_FOUND",
                "Order not found",
                $"Order {id} was not found.");
        }

        // PATCH succeeded. No response body is returned.
        return NoContent();
    }
}
