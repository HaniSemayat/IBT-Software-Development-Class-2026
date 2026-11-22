namespace AddisEats.Api.Models;

public record MenuItem(
    int Id,
    int RestaurantId,
    string Name,
    string Description,
    decimal PriceEtb,
    string Category,
    bool IsAvailable
);
