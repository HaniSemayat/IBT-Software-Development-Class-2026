using AddisEats.Api.Data;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Dtos;

namespace AddisEats.Api.Services;

public class OrderService : IOrderService
{
    public Order? GetById(int id)
    {
        return OrderStore.Orders.FirstOrDefault(o => o.Id == id);
    }

    public Order Create(CreateOrderRequest request)
    {
        var order = new Order
        {
            Id = OrderStore.Orders.Count == 0
                ? 1
                : OrderStore.Orders.Max(o => o.Id) + 1,

            RestaurantId = request.RestaurantId,
            Area = request.Area,
            Qty = request.Qty,
            Status = OrderStatus.Placed,
            Notes = request.Notes
        };

        OrderStore.Orders.Add(order);

        return order;
    }

    public Order? UpdateStatus(int id, OrderStatus status)
    {
        var order = GetById(id);

        if (order is null)
            return null;

        order.Status = status;

        return order;
    }
}
