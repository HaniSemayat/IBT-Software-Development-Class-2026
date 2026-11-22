# AddisEats.OrderBook

A C# console application for managing Addis Eats restaurant orders.

## Features

- Menu item and order management
- Price and quantity validation
- Automatic order total calculation
- Filter orders by delivery area
- Sort area orders by total, highest first
- Calculate total revenue
- Identify the busiest food category by units sold
- Display orders using five-record pagination
- LINQ-based data processing

## Technologies

- C#
- .NET
- LINQ
- Records and classes
- Collections and exception handling

## Run the project

```powershell
dotnet restore
dotnet build
dotnet run
Project structure
- Models/MenuItem.cs - Menu item record
- Models/OrderLine.cs - Order line record
- Models/Order.cs - Order class and computed total
- Services/OrderBook.cs - Order management and LINQ queries
- Program.cs - Interactive console application
The application starts with sample orders so its reporting and pagination features can be demonstrated immediately.
