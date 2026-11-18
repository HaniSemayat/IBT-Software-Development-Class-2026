
using System;
using System.Collections.Generic;


// EXERCISE 2: Console Output and DateTime


Console.WriteLine("===== EXERCISE 2 =====");

string studentName = "Addis Tesfa";
DateTime today = DateTime.Today;

Console.WriteLine($"Name: {studentName}");
Console.WriteLine($"Date: {today:dd MMM yyyy}");
Console.WriteLine("CodeOps Module 4 — .NET track");



// EXERCISE 3: Primitive Data Types


Console.WriteLine("\n===== EXERCISE 3 =====");

string restaurantName = "Addis Eats";
int availableSeats = 120;
long totalOrders = 250000L;
decimal menuPrice = 480.50m;
double latitude = 9.0192;
bool isOpen = true;
char foodRating = 'A';
DateTime openingDate = new DateTime(2026, 1, 15);

Console.WriteLine($"string: {restaurantName}");
Console.WriteLine($"int: {availableSeats}");
Console.WriteLine($"long: {totalOrders}");
Console.WriteLine($"decimal: {menuPrice:N2}");
Console.WriteLine($"double: {latitude}");
Console.WriteLine($"bool: {isOpen}");
Console.WriteLine($"char: {foodRating}");
Console.WriteLine($"DateTime: {openingDate:dd MMM yyyy}");



// EXERCISE 4: Formatted ETB Receipt


Console.WriteLine("\n===== EXERCISE 4 =====");

decimal subtotal = 1480.5m;
decimal deliveryFee = 60m;
decimal total = subtotal + deliveryFee;

Console.WriteLine($"Subtotal: {subtotal,10:N2} ETB");
Console.WriteLine($"Delivery: {deliveryFee,10:N2} ETB");
Console.WriteLine($"Total:    {total,10:N2} ETB");



// EXERCISE 5: Integer vs Decimal Division


Console.WriteLine("\n===== EXERCISE 5 =====");

int integerResult = 7 / 2;
decimal decimalResult = (decimal)7 / 2;

Console.WriteLine($"Integer division: {integerResult}");
Console.WriteLine($"Decimal division: {decimalResult}");

// Use decimal division when splitting an ETB delivery fee
// between three people, because the result may contain fractions.



// EXERCISE 6: Value Types vs Reference Types


Console.WriteLine("\n===== EXERCISE 6 =====");

// Value types copy their actual value.
// Changing the copy does not change the original.

int originalSeats = 120;
int copiedSeats = originalSeats;

copiedSeats = 150;

Console.WriteLine($"Original seats: {originalSeats}");
Console.WriteLine($"Copied seats: {copiedSeats}");

// Reference types copy the reference to the same object.
// Both variables point to the same List.

List<string> firstAreas = new List<string> { "Bole" };
List<string> secondAreas = firstAreas;

secondAreas.Add("Piassa");

Console.WriteLine($"First areas: {string.Join(", ", firstAreas)}");
Console.WriteLine($"Second areas: {string.Join(", ", secondAreas)}");



// EXERCISE 7: Nullable Values


Console.WriteLine("\n===== EXERCISE 7 =====");

string? deliveryNote = null;

// Method 1: Explicit null check

if (deliveryNote != null)
{
    Console.WriteLine($"Explicit check length: {deliveryNote.Length}");
}
else
{
    Console.WriteLine("Explicit check: No delivery note provided.");
}

// Method 2: Null-coalescing operator (??)

int fallbackLength = (deliveryNote ?? "").Length;

Console.WriteLine($"Length using ??: {fallbackLength}");

// Method 3: Null-conditional operator (?.)

Console.WriteLine($"Length using ?.: {deliveryNote?.Length}");



// EXERCISE 8: Safe Input with TryParse


Console.WriteLine("\n===== EXERCISE 8 =====");

Console.Write("Enter an ETB amount: ");

string? amountInput = Console.ReadLine();

if (!decimal.TryParse(amountInput, out decimal amount))
{
    Console.WriteLine("Invalid input. Please enter a number.");
}
else if (amount <= 0m)
{
    Console.WriteLine("Amount must be greater than zero.");
}
else
{
    Console.WriteLine($"Valid amount: {amount:N2} ETB");
}

Console.WriteLine("\n===== EXERCISES COMPLETED =====");
