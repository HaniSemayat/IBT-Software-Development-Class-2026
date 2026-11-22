namespace AddisEats.Api.Models;

public enum OrderStatus
{
    Placed,
    Preparing,
    Ready,
    Delivered,
    Cancelled
}

public class Order
{
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public string Area { get; set; } = "";

    public int Qty { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Placed;

    public string? Notes { get; set; }
}
