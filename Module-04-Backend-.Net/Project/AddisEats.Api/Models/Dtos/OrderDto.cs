using AddisEats.Api.Models;

namespace AddisEats.Api.Models.Dtos;

public record OrderLineDto(
    int MenuItemId,
    string Name,
    int Qty,
    decimal UnitPriceEtb,
    decimal LineTotalEtb
);

public record OrderDto(
    int Id,
    int RestaurantId,
    string Area,
    string Phone,
    IReadOnlyList<OrderLineDto> Items,
    decimal SubtotalEtb,
    decimal DeliveryFeeEtb,
    decimal TotalEtb,
    bool IsScheduled,
    DateTime? ScheduledFor,
    OrderStatus Status,
    string? Notes
);

public static class OrderMapping
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto(
            order.Id,
            order.RestaurantId,
            order.Area,
            order.Phone,
            order.Items.Select(item => new OrderLineDto(
                item.MenuItemId,
                item.Name,
                item.Qty,
                item.UnitPriceEtb,
                item.LineTotalEtb
            )).ToList(),
            order.SubtotalEtb,
            order.DeliveryFeeEtb,
            order.TotalEtb,
            order.IsScheduled,
            order.ScheduledFor,
            order.Status,
            order.Notes
        );
    }
}
