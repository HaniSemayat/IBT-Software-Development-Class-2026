using AddisEats.Api.Models;

namespace AddisEats.Api.Models.Dtos;

public record MenuItemDto(
    int Id,
    string Name,
    string Description,
    decimal PriceEtb,
    string Category,
    bool IsAvailable
);

public static class RestaurantMapping
{
    public static RestaurantDto ToDto(this Restaurant restaurant)
    {
        return new RestaurantDto(
            restaurant.Id,
            restaurant.Name,
            restaurant.Area,
            restaurant.DeliveryFeeEtb
        );
    }
}

public static class MenuMapping
{
    public static MenuItemDto ToDto(this MenuItem item)
    {
        return new MenuItemDto(
            item.Id,
            item.Name,
            item.Description,
            item.PriceEtb,
            item.Category,
            item.IsAvailable
        );
    }
}
