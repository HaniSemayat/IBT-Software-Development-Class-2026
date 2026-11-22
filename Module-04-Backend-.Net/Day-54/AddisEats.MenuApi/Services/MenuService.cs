using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public class MenuService : IMenuService
{
    private readonly List<MenuItem> _items =
    [
        new(1, "Special Tibs", "Main Course", 450m),
        new(2, "Shiro", "Main Course", 180m),
        new(3, "Doro Wot", "Main Course", 380m),
        new(4, "Ethiopian Coffee", "Beverage", 90m),
        new(5, "Fresh Juice", "Beverage", 120m),
        new(6, "Sambusa", "Snack", 60m),
        new(7, "Pasta", "Main Course", 250m)
    ];

    public IReadOnlyList<MenuItem> GetAll(string? category)
    {
        return _items
            .Where(item => string.IsNullOrWhiteSpace(category) ||
                item.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public MenuItem? GetById(int id)
    {
        return _items.FirstOrDefault(item => item.Id == id);
    }

    public MenuItem Create(CreateMenuItemRequest request)
    {
        if (request.PriceEtb <= 0m)
        {
            throw new ArgumentException("The menu item price must be positive.");
        }

        var item = new MenuItem(
            _items.Count == 0 ? 1 : _items.Max(existing => existing.Id) + 1,
            request.Name,
            request.Category,
            request.PriceEtb
        );

        _items.Add(item);

        return item;
    }
}
