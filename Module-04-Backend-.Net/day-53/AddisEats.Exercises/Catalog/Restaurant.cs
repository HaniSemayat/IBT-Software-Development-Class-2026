namespace AddisEats.Catalog;

public class Restaurant
{
    public int Id { get; init; }

    public string Name { get; set; } = "";

    public string Area { get; set; } = "";

    public string DisplayName => $"{Name} ({Area})";
}
