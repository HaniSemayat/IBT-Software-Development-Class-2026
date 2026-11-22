public class Describer
{
    public void Describe(int value)
    {
        Console.WriteLine($"Integer overload selected: {value}");
    }

    public void Describe(string value)
    {
        Console.WriteLine($"String overload selected: {value}");
    }

    public void Describe(decimal value)
    {
        Console.WriteLine($"Decimal overload selected: {value:N2}");
    }
}
