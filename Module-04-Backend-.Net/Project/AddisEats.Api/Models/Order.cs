namespace AddisEats.Api.Models;

public enum OrderStatus
{
    Placed,
    Preparing,
    Ready,
    Delivered,
    Cancelled
}

public record OrderLine(
    int MenuItemId,
    string Name,
    int Qty,
    decimal UnitPriceEtb,
    decimal LineTotalEtb
);

public class Order
{
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public string Area { get; set; } = "";

    public string Phone { get; set; } = "";

    public List<OrderLine> Items { get; set; } = new();

    public decimal SubtotalEtb { get; set; }

    public decimal DeliveryFeeEtb { get; set; }

    public decimal TotalEtb { get; set; }

    public bool IsScheduled { get; set; }

    public DateTime? ScheduledFor { get; set; }

    public string? Notes { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Placed;
}
