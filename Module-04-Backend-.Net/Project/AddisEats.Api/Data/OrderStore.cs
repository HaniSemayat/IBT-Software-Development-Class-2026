using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public static class OrderStore
{
    public static readonly List<Order> Orders = new()
    {
        new Order
        {
            Id = 1,
            RestaurantId = 1,
            Area = "Bole",
            Qty = 2,
            Status = OrderStatus.Placed
        }
    };
}
