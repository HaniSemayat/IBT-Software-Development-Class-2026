using AddisEats.OrderBook.Models;

namespace AddisEats.OrderBook.Services;

public class OrderBook
{
    private readonly List<Order> _orders = new();

    public void AddOrder(Order order)
    {
        ArgumentNullException.ThrowIfNull(order);
        _orders.Add(order);
    }

    public IReadOnlyList<Order> GetOrdersByArea(string area)
    {
        return _orders
            .Where(order => order.Area.Equals(area, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(order => order.Total)
            .ToList();
    }

    public decimal GetTotalRevenue()
    {
        return _orders.Sum(order => order.Total);
    }

    public string? GetBusiestCategory()
    {
        return _orders
            .SelectMany(order => order.Lines)
            .GroupBy(line => line.Item.Category)
            .Select(group => new
            {
                Category = group.Key,
                UnitsSold = group.Sum(line => line.Quantity)
            })
            .OrderByDescending(group => group.UnitsSold)
            .ThenBy(group => group.Category)
            .Select(group => group.Category)
            .FirstOrDefault();
    }

    public IReadOnlyList<Order> GetPage(int pageNumber)
    {
        if (pageNumber <= 0)
        {
            throw new ArgumentException("Page number must be positive.", nameof(pageNumber));
        }

        const int pageSize = 5;

        return _orders
            .OrderByDescending(order => order.Total)
            .ThenBy(order => order.Customer, StringComparer.OrdinalIgnoreCase)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public int OrderCount => _orders.Count;
}
