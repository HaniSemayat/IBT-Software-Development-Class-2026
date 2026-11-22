namespace AddisEats.Catalog;

public static class AmountValidator
{
    public static void Validate(decimal amount)
    {
        if (amount <= 0m)
        {
            throw new ArgumentException("The ETB amount must be positive.");
        }
    }
}
