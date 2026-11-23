using AddisEats.Api.Common;
using AddisEats.Api.Data;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Dtos;
using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Services;

public class OrderService : IOrderService
{
    private readonly IRestaurantService _restaurants;
    private readonly IMenuService _menu;

    public OrderService(
        IRestaurantService restaurants,
        IMenuService menu)
    {
        _restaurants = restaurants;
        _menu = menu;
    }

    public Result<Order> GetById(int id)
    {
        var order = OrderStore.Orders.FirstOrDefault(o => o.Id == id);

        if (order is null)
        {
            return Result<Order>.Fail(
                "ORDER_NOT_FOUND",
                $"Order {id} was not found.",
                404);
        }

        return Result<Order>.Ok(order);
    }

    public Result<Order> Place(CreateOrderRequest request)
    {
        // Business rule 1: the restaurant must exist.
        var restaurantResult = _restaurants.GetById(request.RestaurantId);

        if (!restaurantResult.IsSuccess)
        {
            var error = restaurantResult.Error!;
            return Result<Order>.Fail(
                error.Code, error.Message, error.Status);
        }

        var restaurant = restaurantResult.Value!;

        // Business rule 2: an existing restaurant may be closed.
        if (!restaurant.IsOpen)
        {
            return Result<Order>.Fail(
                "RESTAURANT_CLOSED",
                "This restaurant is currently closed and cannot accept orders.",
                409);
        }

        // Business rule 3: maximum five open orders per phone number.
        var openStatuses = new[]
        {
            OrderStatus.Placed,
            OrderStatus.Preparing,
            OrderStatus.Ready
        };

        var openOrderCount = OrderStore.Orders.Count(order =>
            order.Phone == request.Phone &&
            openStatuses.Contains(order.Status));

        if (openOrderCount >= 5)
        {
            return Result<Order>.Fail(
                "TOO_MANY_OPEN_ORDERS",
                "This phone number already has five open orders.",
                409);
        }

        var orderLines = new List<OrderLine>();
        decimal subtotal = 0m;

        foreach (var requestedLine in request.Items)
        {
            var menuResult = _menu.GetById(requestedLine.MenuItemId);

            if (!menuResult.IsSuccess)
            {
                var error = menuResult.Error!;
                return Result<Order>.Fail(
                    error.Code, error.Message, error.Status);
            }

            var menuItem = menuResult.Value!;

            // Business rule 4: an item must belong to this restaurant.
            if (menuItem.RestaurantId != restaurant.Id)
            {
                return Result<Order>.Fail(
                    "MENU_ITEM_NOT_IN_RESTAURANT",
                    $"Menu item {menuItem.Id} does not belong to restaurant {restaurant.Id}.",
                    422);
            }

            // Validate server-owned prices before calculating money.
            EnsureValidServerPrice(menuItem);

            var lineTotal = menuItem.PriceEtb * requestedLine.Qty;
            subtotal += lineTotal;

            orderLines.Add(new OrderLine(
                menuItem.Id,
                menuItem.Name,
                requestedLine.Qty,
                menuItem.PriceEtb,
                lineTotal));
        }

        EnsureValidServerPrice(restaurant);

        // All monetary values are calculated from server-owned data.
        var deliveryFee = restaurant.DeliveryFeeEtb;
        var total = subtotal + deliveryFee;

        var order = new Order
        {
            Id = OrderStore.Orders.Count == 0
                ? 1
                : OrderStore.Orders.Max(o => o.Id) + 1,

            RestaurantId = restaurant.Id,
            Area = request.Area,
            Phone = request.Phone,
            Items = orderLines,
            SubtotalEtb = subtotal,
            DeliveryFeeEtb = deliveryFee,
            TotalEtb = total,
            IsScheduled = request.IsScheduled,
            ScheduledFor = request.ScheduledFor,
            Notes = request.Notes,
            Status = OrderStatus.Placed
        };

        OrderStore.Orders.Add(order);

        return Result<Order>.Ok(order);
    }

    public Result<Order> UpdateStatus(int id, OrderStatus status)
    {
        var result = GetById(id);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return Result<Order>.Fail(
                error.Code, error.Message, error.Status);
        }

        var order = result.Value!;

        if (order.Status == OrderStatus.Delivered
            && status == OrderStatus.Cancelled)
        {
            return Result<Order>.Fail(
                "ORDER_ALREADY_DELIVERED",
                "A delivered order cannot be cancelled.",
                409);
        }

        order.Status = status;

        return Result<Order>.Ok(order);
    }

    private static void EnsureValidServerPrice(object model)
    {
        var errors = new List<ValidationResult>();

        var valid = Validator.TryValidateObject(
            model,
            new ValidationContext(model),
            errors,
            validateAllProperties: true);

        if (!valid)
        {
            // Invalid server-owned pricing is a server integrity problem,
            // not a validation error that should be blamed on the customer.
            throw new InvalidOperationException(
                "Server-owned pricing data failed validation.");
        }
    }
}
