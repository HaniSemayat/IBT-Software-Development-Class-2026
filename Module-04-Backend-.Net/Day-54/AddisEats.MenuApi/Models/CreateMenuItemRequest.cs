using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Models;

public record CreateMenuItemRequest
{
    [Required]
    public string Name { get; init; } = "";

    [Required]
    public string Category { get; init; } = "";

    public decimal PriceEtb { get; init; }
}
