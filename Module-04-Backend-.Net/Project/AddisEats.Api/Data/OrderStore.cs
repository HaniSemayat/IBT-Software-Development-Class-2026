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
            Phone = "0911000999",
            Items = new List<OrderLine>
            {
                new(1, "Special Firfir", 2, 180m, 360m)
            },
            SubtotalEtb = 360m,
            DeliveryFeeEtb = 45m,
            TotalEtb = 405m,
            Status = OrderStatus.Placed,
            Notes = "Seed order"
        }
    };
}
