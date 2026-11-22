using AddisEats.OrderBook.Models;
using AddisEats.OrderBook.Services;

var menu = new List<MenuItem>
{
    new(1, "Special Tibs", "Main Course", 450m),
    new(2, "Shiro", "Main Course", 180m),
    new(3, "Doro Wot", "Main Course", 380m),
    new(4, "Ethiopian Coffee", "Beverage", 90m),
    new(5, "Fresh Juice", "Beverage", 120m),
    new(6, "Sambusa", "Snack", 60m),
    new(7, "Pasta", "Main Course", 250m)
};

var orderBook = new OrderBook();
SeedOrders(orderBook, menu);

while (true)
{
    Console.WriteLine();
    Console.WriteLine("Addis Eats - Order Book");
    Console.WriteLine("1. View menu");
    Console.WriteLine("2. Place an order");
    Console.WriteLine("3. View orders by area");
    Console.WriteLine("4. View sales summary");
    Console.WriteLine("5. View orders page");
    Console.WriteLine("0. Exit");
    Console.Write("Choose an option: ");

    switch (Console.ReadLine())
    {
        case "1":
            DisplayMenu(menu);
            break;

        case "2":
            PlaceOrder(menu, orderBook);
            break;

        case "3":
            string area = ReadText("Enter delivery area: ");
            var areaOrders = orderBook.GetOrdersByArea(area);

            Console.WriteLine($"\nOrders in {area}:");

            if (areaOrders.Count == 0)
            {
                Console.WriteLine("No orders found.");
            }
            else
            {
                areaOrders.ToList().ForEach(PrintOrder);
            }
            break;

        case "4":
            Console.WriteLine("\nSales Summary");
            Console.WriteLine($"Total orders: {orderBook.OrderCount}");
            Console.WriteLine($"Total revenue: {orderBook.GetTotalRevenue():N2} ETB");
            Console.WriteLine($"Busiest category: {orderBook.GetBusiestCategory() ?? "No sales yet"}");
            break;

        case "5":
            int pageNumber = ReadInteger("Enter page number: ");

            try
            {
                var page = orderBook.GetPage(pageNumber);

                Console.WriteLine($"\nPage {pageNumber}:");

                if (page.Count == 0)
                {
                    Console.WriteLine("No orders on this page.");
                }
                else
                {
                    page.ToList().ForEach(PrintOrder);
                }
            }
            catch (ArgumentException exception)
            {
                Console.WriteLine(exception.Message);
            }
            break;

        case "0":
            Console.WriteLine("Thank you for using Addis Eats Order Book.");
            return;

        default:
            Console.WriteLine("Invalid option. Please try again.");
            break;
    }
}

static void DisplayMenu(List<MenuItem> menu)
{
    Console.WriteLine("\nMenu");

    menu.ForEach(item =>
        Console.WriteLine($"{item.Id}. {item.Name} | {item.Category} | {item.PriceEtb:N2} ETB"));
}

static void PlaceOrder(List<MenuItem> menu, OrderBook orderBook)
{
    string customer = ReadText("Customer name: ");
    string area = ReadText("Delivery area: ");
    var lines = new List<OrderLine>();

    while (true)
    {
        DisplayMenu(menu);
        int itemId = ReadInteger("Enter item ID (0 to finish): ");

        if (itemId == 0)
        {
            break;
        }

        var item = menu.FirstOrDefault(menuItem => menuItem.Id == itemId);

        if (item is null)
        {
            Console.WriteLine("Item not found.");
            continue;
        }

        int quantity = ReadInteger("Enter quantity: ");

        try
        {
            lines.Add(new OrderLine(item, quantity));
            Console.WriteLine("Item added to order.");
        }
        catch (ArgumentException exception)
        {
            Console.WriteLine(exception.Message);
        }
    }

    if (lines.Count == 0)
    {
        Console.WriteLine("No items were added. Order was not created.");
        return;
    }

    var order = new Order(customer, area, lines);
    orderBook.AddOrder(order);

    Console.WriteLine("\nOrder created successfully.");
    PrintOrder(order);
}

static void PrintOrder(Order order)
{
    Console.WriteLine($"Customer: {order.Customer} | Area: {order.Area}");

    order.Lines.ToList().ForEach(line =>
        Console.WriteLine($"  {line.Item.Name} x {line.Quantity} = {line.Item.PriceEtb * line.Quantity:N2} ETB"));

    Console.WriteLine($"  Total: {order.Total:N2} ETB");
}

static string ReadText(string prompt)
{
    while (true)
    {
        Console.Write(prompt);
        string? value = Console.ReadLine();

        if (!string.IsNullOrWhiteSpace(value))
        {
            return value.Trim();
        }

        Console.WriteLine("This field cannot be empty.");
    }
}

static int ReadInteger(string prompt)
{
    while (true)
    {
        Console.Write(prompt);

        if (int.TryParse(Console.ReadLine(), out int value))
        {
            return value;
        }

        Console.WriteLine("Please enter a valid whole number.");
    }
}

static void SeedOrders(OrderBook orderBook, List<MenuItem> menu)
{
    orderBook.AddOrder(new Order("Abebe", "Bole", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 1), 2),
        new OrderLine(menu.Single(item => item.Id == 4), 2)
    }));

    orderBook.AddOrder(new Order("Mekdes", "Kazanchis", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 3), 1),
        new OrderLine(menu.Single(item => item.Id == 6), 3)
    }));

    orderBook.AddOrder(new Order("Dawit", "Piassa", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 2), 2),
        new OrderLine(menu.Single(item => item.Id == 5), 2)
    }));

    orderBook.AddOrder(new Order("Sara", "Bole", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 1), 1),
        new OrderLine(menu.Single(item => item.Id == 7), 2)
    }));

    orderBook.AddOrder(new Order("Hana", "Kazanchis", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 4), 3),
        new OrderLine(menu.Single(item => item.Id == 6), 4)
    }));

    orderBook.AddOrder(new Order("Yonas", "Bole", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 3), 2),
        new OrderLine(menu.Single(item => item.Id == 5), 2)
    }));

    orderBook.AddOrder(new Order("Rahel", "Piassa", new[]
    {
        new OrderLine(menu.Single(item => item.Id == 2), 3),
        new OrderLine(menu.Single(item => item.Id == 4), 2)
    }));
}
