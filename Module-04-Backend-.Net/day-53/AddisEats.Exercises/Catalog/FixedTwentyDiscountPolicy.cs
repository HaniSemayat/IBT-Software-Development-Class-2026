namespace AddisEats.Catalog;

public class FixedTwentyDiscountPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount)
    {
        return Math.Max(0m, amount - 20m);
    }
}
