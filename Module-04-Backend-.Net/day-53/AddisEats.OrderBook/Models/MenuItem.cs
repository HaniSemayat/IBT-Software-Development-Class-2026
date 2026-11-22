namespace AddisEats.OrderBook.Models;

public record MenuItem
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string Category { get; init; }
    public decimal PriceEtb { get; init; }

    public MenuItem(int id, string name, string category, decimal priceEtb)
    {
        if (priceEtb <= 0m)
        {
            throw new ArgumentException("The menu item price must be positive.", nameof(priceEtb));
        }

        Id = id;
        Name = name;
        Category = category;
        PriceEtb = priceEtb;
    }
}
