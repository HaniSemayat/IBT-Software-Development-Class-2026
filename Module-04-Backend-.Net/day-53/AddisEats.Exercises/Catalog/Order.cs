namespace AddisEats.Catalog;

public class Order
{
    public int Id { get; }

    public string CustomerName { get; }

    public string Area { get; }

    public decimal Subtotal { get; }

    public DateTime PlacedOn { get; }

    public Order(int id, string customerName, string area, decimal subtotal, DateTime placedOn)
    {
        Id = id;
        CustomerName = customerName;
        Area = area;
        Subtotal = subtotal;
        PlacedOn = placedOn;
    }
}
