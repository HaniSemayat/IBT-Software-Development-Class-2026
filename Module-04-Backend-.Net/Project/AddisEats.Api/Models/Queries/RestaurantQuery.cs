namespace AddisEats.Api.Models.Queries;

public class RestaurantQuery
{
    public string? Area { get; set; }

    public List<string> Areas { get; set; } = new();

    public decimal? MaxFeeEtb { get; set; }

    public int Page { get; set; } = 1;

    public int Limit { get; set; } = 20;

    public string? Sort { get; set; }
}
