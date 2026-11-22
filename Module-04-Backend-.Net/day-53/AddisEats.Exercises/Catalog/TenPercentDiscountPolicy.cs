namespace AddisEats.Catalog;

public class TenPercentDiscountPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount)
    {
        return amount * 0.90m;
    }
}
