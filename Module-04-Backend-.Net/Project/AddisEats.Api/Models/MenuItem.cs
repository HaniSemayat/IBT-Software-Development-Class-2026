using AddisEats.Api.Validation;
using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Models;

public record MenuItem(
    int Id,
    int RestaurantId,
    string Name,
    string Description,
    [property: EtbAmount] decimal PriceEtb,
    string Category,
    bool IsAvailable
);
