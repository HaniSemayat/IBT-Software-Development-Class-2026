using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Models.Queries;

public class RestaurantQuery
{
    [StringLength(60, MinimumLength = 2,
        ErrorMessage = "Area must contain between 2 and 60 characters.")]
    public string? Area { get; set; }

    public List<string> Areas { get; set; } = new();

    [Range(typeof(decimal), "0", "1000000",
        ErrorMessage = "Maximum delivery fee must be zero or greater.")]
    public decimal? MaxFeeEtb { get; set; }

    [Range(1, int.MaxValue,
        ErrorMessage = "Page must be 1 or greater.")]
    public int Page { get; set; } = 1;

    [Range(1, 1000,
        ErrorMessage = "Limit must be between 1 and 1000.")]
    public int Limit { get; set; } = 20;

    [StringLength(40,
        ErrorMessage = "Sort value is too long.")]
    public string? Sort { get; set; }
}
