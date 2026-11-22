namespace AddisEats.Catalog;

public class FiftyBirrDiscountPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount)
    {
        return Math.Max(0m, amount - 50m);
    }
}
