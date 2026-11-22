using AddisEats.Api.Models;

namespace AddisEats.Api.Models.Dtos;

public record OrderDto(
    int Id,
    int RestaurantId,
    string Area,
    int Qty,
    OrderStatus Status,
    string? Notes
);

public record CreateOrderRequest(
    int RestaurantId,
    string Area,
    int Qty,
    string? Notes
);

public record UpdateOrderStatusRequest(
    OrderStatus Status
);

public static class OrderMapping
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto(
            order.Id,
            order.RestaurantId,
            order.Area,
            order.Qty,
            order.Status,
            order.Notes
        );
    }
}
