using AddisEats.Catalog;

Console.WriteLine("Exercise 1: Delivery fees");

Console.WriteLine($"Positional arguments: {DeliveryFee("Bole", false)} ETB");
Console.WriteLine($"Named argument: {DeliveryFee("Piassa", isVip: true)} ETB");
Console.WriteLine($"Default argument: {DeliveryFee("Kazanchis")} ETB");

Console.WriteLine();
Console.WriteLine("Exercise 2: Method overloading");

var describer = new Describer();

describer.Describe(42);
describer.Describe("Addis Eats");
describer.Describe(320.50m);

Console.WriteLine();
Console.WriteLine("Exercise 3: Restaurant properties");

var restaurant = new Restaurant
{
    Id = 1,
    Name = "Addis Eats",
    Area = "Bole"
};

Console.WriteLine($"Initial ID: {restaurant.Id}");
Console.WriteLine($"Display name: {restaurant.DisplayName}");

restaurant.Name = "Addis Eats Kitchen";
Console.WriteLine($"Updated display name: {restaurant.DisplayName}");

Console.WriteLine();
Console.WriteLine("Exercise 4: Records and classes");

var customer1 = new Customer("Almaz Bekele", "0911000000");
var customer2 = new Customer("Almaz Bekele", "0911000000");

Console.WriteLine($"Identical records are equal: {customer1 == customer2}");

var classCustomer1 = new CustomerClass("Almaz Bekele", "0911000000");
var classCustomer2 = new CustomerClass("Almaz Bekele", "0911000000");

Console.WriteLine($"Identical class objects are equal: {classCustomer1 == classCustomer2}");
Console.WriteLine("Records compare their values by default; classes compare object references by default.");

Console.WriteLine();
Console.WriteLine("Exercise 5: LINQ queries");

var customerNames = new[]
{
    "Almaz", "Dawit", "Hana", "Mekdes", "Abebe",
    "Sara", "Yonas", "Meron", "Samuel", "Rahel"
};

var areas = new[] { "Bole", "Kazanchis", "Piassa" };

var orders = Enumerable.Range(1, 30)
    .Select(i => new Order(
        i,
        customerNames[(i - 1) % customerNames.Length],
        areas[(i - 1) % areas.Length],
        200m + (i * 35m),
        DateTime.Today.AddDays(-i)))
    .ToList();

var boleOrdersOver500 = orders
    .Where(order => order.Area == "Bole" && order.Subtotal > 500m)
    .ToList();

Console.WriteLine("Bole orders over 500 ETB:");
foreach (var order in boleOrdersOver500)
{
    Console.WriteLine($"{order.CustomerName}: {order.Subtotal:N2} ETB");
}

var sortedCustomerNames = orders
    .Select(order => order.CustomerName)
    .OrderBy(name => name)
    .ToList();

Console.WriteLine($"Customer names alphabetically: {string.Join(", ", sortedCustomerNames)}");

decimal kazanchisRevenue = orders
    .Where(order => order.Area == "Kazanchis")
    .Sum(order => order.Subtotal);

Console.WriteLine($"Kazanchis revenue: {kazanchisRevenue:N2} ETB");

var page3 = orders
    .OrderByDescending(order => order.PlacedOn)
    .ThenByDescending(order => order.Id)
    .Skip(20)
    .Take(10)
    .ToList();

Console.WriteLine("Page 3, newest first:");
foreach (var order in page3)
{
    Console.WriteLine($"Order {order.Id}: {order.CustomerName}, {order.PlacedOn:d}, {order.Subtotal:N2} ETB");
}

Console.WriteLine();
Console.WriteLine("Exercise 6: Discount policies");

Console.WriteLine($"10% discount: {ApplyDiscount(new TenPercentDiscountPolicy(), 500m):N2} ETB");
Console.WriteLine($"50 ETB discount: {ApplyDiscount(new FiftyBirrDiscountPolicy(), 500m):N2} ETB");
Console.WriteLine($"Third policy: {ApplyDiscount(new FixedTwentyDiscountPolicy(), 500m):N2} ETB");

Console.WriteLine();
Console.WriteLine("Exercise 7: Exceptions and finally");

CheckAmount(250m);
CheckAmount(0m);

decimal DeliveryFee(string area, bool isVip = false)
{
    if (isVip)
    {
        return 0m;
    }

    return area switch
    {
        "Bole" => 50m,
        "Piassa" => 65m,
        "Kazanchis" => 60m,
        _ => 80m
    };
}

decimal ApplyDiscount(IDiscountPolicy policy, decimal amount)
{
    return policy.Apply(amount);
}

void CheckAmount(decimal amount)
{
    try
    {
        AmountValidator.Validate(amount);
        Console.WriteLine($"Valid amount: {amount:N2} ETB");
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine($"Invalid amount: {ex.Message}");
    }
    finally
    {
        Console.WriteLine("Finally block executed.");
    }
}
