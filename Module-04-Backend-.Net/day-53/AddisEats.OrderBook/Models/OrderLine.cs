namespace AddisEats.OrderBook.Models;

public record OrderLine
{
    public MenuItem Item { get; init; }
    public int Quantity { get; init; }

    public OrderLine(MenuItem item, int quantity)
    {
        ArgumentNullException.ThrowIfNull(item);

        if (quantity <= 0)
        {
            throw new ArgumentException("The order quantity must be positive.", nameof(quantity));
        }

        Item = item;
        Quantity = quantity;
    }
}
