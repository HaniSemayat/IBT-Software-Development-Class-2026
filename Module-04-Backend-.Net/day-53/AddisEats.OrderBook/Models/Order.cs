namespace AddisEats.OrderBook.Models;

public class Order
{
    public string Customer { get; }
    public string Area { get; }
    public IReadOnlyList<OrderLine> Lines { get; }

    public decimal Total => Lines.Sum(line => line.Item.PriceEtb * line.Quantity);

    public Order(string customer, string area, IEnumerable<OrderLine> lines)
    {
        ArgumentNullException.ThrowIfNull(lines);

        Customer = customer;
        Area = area;
        Lines = lines.ToList();
    }
}
