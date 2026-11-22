namespace AddisEats.Catalog;

public interface IDiscountPolicy
{
    decimal Apply(decimal amount);
}
