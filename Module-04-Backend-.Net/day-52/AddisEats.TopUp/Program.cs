
using System;
using System.Globalization;

// ================================================
// ADDIS EATS - MOBILE TOP-UP CALCULATOR
// CodeOps Module 4 - .NET Track
// ================================================

// ---------- APPLICATION SETTINGS ----------

const int CustomerCount = 5;
const decimal MaximumTopUp = 5000m;
const decimal ExtraBonusThreshold = 1000m;
const decimal ExtraBonusAmount = 20m;

// ---------- APPLICATION COLORS ----------

Console.ForegroundColor = ConsoleColor.Cyan;
Console.BackgroundColor = ConsoleColor.Black;

// ---------- MAIN MENU ----------

bool running = true;

while (running)
{
    Console.Clear();

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("==================================================");
    Console.WriteLine("                  ADDIS EATS                      ");
    Console.WriteLine("             MOBILE TOP-UP SYSTEM                 ");
    Console.WriteLine("==================================================");
    Console.ResetColor();

    Console.WriteLine();
    Console.WriteLine("Welcome to AddisEats Top-Up Console!");
    Console.WriteLine();
    Console.WriteLine("  1. Start Top-Up Session");
    Console.WriteLine("  2. Exit Application");
    Console.WriteLine();

    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.Write("Select an option (1-2): ");
    Console.ResetColor();

    string? menuChoice = Console.ReadLine();

    if (menuChoice == "1")
    {
        // ============================================
        // CUSTOMER DATA ARRAYS
        // ============================================

        string[] customerNames = new string[CustomerCount];
        string[] networks = new string[CustomerCount];

        decimal[] amounts = new decimal[CustomerCount];
        decimal[] bonusRates = new decimal[CustomerCount];
        decimal[] networkBonuses = new decimal[CustomerCount];
        decimal[] extraBonuses = new decimal[CustomerCount];
        decimal[] finalCredits = new decimal[CustomerCount];

        decimal grandTotal = 0m;

        // ============================================
        // CUSTOMER REGISTRATION AND TOP-UP PROCESS
        // ============================================

        for (int i = 0; i < CustomerCount; i++)
        {
            Console.Clear();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("==================================================");
            Console.WriteLine("                CUSTOMER TOP-UP                  ");
            Console.WriteLine("==================================================");
            Console.ResetColor();

            Console.WriteLine();
            Console.WriteLine($"Customer {i + 1} of {CustomerCount}");
            Console.WriteLine("-----------------------------------------------");

            // CUSTOMER NAME

            while (true)
            {
                Console.Write("Enter customer name: ");

                string? nameInput = Console.ReadLine();

                if (!string.IsNullOrWhiteSpace(nameInput))
                {
                    customerNames[i] = nameInput.Trim();
                    break;
                }

                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Name cannot be empty. Please try again.");
                Console.ResetColor();
            }

            // NETWORK SELECTION

            Console.WriteLine();
            Console.WriteLine("Select mobile network:");
            Console.WriteLine("  1. Ethio Telecom (5% bonus)");
            Console.WriteLine("  2. Safaricom (3% bonus)");
            Console.WriteLine("  3. Other (No network bonus)");

            while (true)
            {
                Console.Write("Choose network (1-3): ");

                string? networkChoice = Console.ReadLine();

                if (networkChoice == "1")
                {
                    networks[i] = "Ethio Telecom";
                    break;
                }
                else if (networkChoice == "2")
                {
                    networks[i] = "Safaricom";
                    break;
                }
                else if (networkChoice == "3")
                {
                    networks[i] = "Other";
                    break;
                }

                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Invalid selection. Choose 1, 2, or 3.");
                Console.ResetColor();
            }

            // TOP-UP AMOUNT VALIDATION

            while (true)
            {
                Console.WriteLine();
                Console.Write($"Enter top-up amount (ETB 0.01 - {MaximumTopUp:N2}): ");

                string? amountInput = Console.ReadLine();

                bool isValidNumber = decimal.TryParse(
                    amountInput,
                    NumberStyles.Number,
                    CultureInfo.InvariantCulture,
                    out decimal amount
                );

                if (!isValidNumber)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Invalid input. Please enter a numeric amount.");
                    Console.ResetColor();
                    continue;
                }

                if (amount <= 0m)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Amount must be greater than zero.");
                    Console.ResetColor();
                    continue;
                }

                if (amount > MaximumTopUp)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Maximum top-up amount is 5,000 ETB.");
                    Console.ResetColor();
                    continue;
                }

                amounts[i] = amount;
                break;
            }

            // ========================================
            // BONUS CALCULATION
            // ========================================

            bonusRates[i] = networks[i] switch
            {
                "Ethio Telecom" => 0.05m,
                "Safaricom" => 0.03m,
                _ => 0m
            };

            networkBonuses[i] = amounts[i] * bonusRates[i];

            extraBonuses[i] = amounts[i] >= ExtraBonusThreshold
                ? ExtraBonusAmount
                : 0m;

            finalCredits[i] = amounts[i]
                + networkBonuses[i]
                + extraBonuses[i];

            grandTotal += finalCredits[i];

            // ========================================
            // CUSTOMER CONFIRMATION SCREEN
            // ========================================

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("-----------------------------------------------");
            Console.WriteLine("         TOP-UP CALCULATED SUCCESSFULLY!");
            Console.WriteLine("-----------------------------------------------");
            Console.ResetColor();

            Console.WriteLine($"Customer:       {customerNames[i]}");
            Console.WriteLine($"Network:        {networks[i]}");
            Console.WriteLine($"Top-up:         {amounts[i],10:N2} ETB");
            Console.WriteLine($"Network Bonus:  {networkBonuses[i],10:N2} ETB");
            Console.WriteLine($"Extra Bonus:    {extraBonuses[i],10:N2} ETB");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("-----------------------------------------------");
            Console.WriteLine($"Final Credit:   {finalCredits[i],10:N2} ETB");
            Console.WriteLine("-----------------------------------------------");
            Console.ResetColor();

            Console.WriteLine();
            Console.Write("Press Enter to continue to the next customer...");
            Console.ReadLine();
        }

        // ============================================
        // FINAL TRANSACTION REPORT
        // ============================================

        Console.Clear();

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("==============================================================");
        Console.WriteLine("                    ADDIS EATS                                ");
        Console.WriteLine("                 TOP-UP TRANSACTION REPORT                    ");
        Console.WriteLine("==============================================================");
        Console.ResetColor();

        Console.WriteLine();

        Console.WriteLine(
            $"{"No.",-5}" +
            $"{"Customer",-18}" +
            $"{"Network",-17}" +
            $"{"Amount",12}" +
            $"{"Bonus",10}" +
            $"{"Credit",12}"
        );

        Console.WriteLine(
            "--------------------------------------------------------------"
        );

        for (int i = 0; i < CustomerCount; i++)
        {
            decimal totalBonus = networkBonuses[i] + extraBonuses[i];

            Console.WriteLine(
                $"{i + 1,-5}" +
                $"{customerNames[i],-18}" +
                $"{networks[i],-17}" +
                $"{amounts[i],12:N2}" +
                $"{totalBonus,10:N2}" +
                $"{finalCredits[i],12:N2}"
            );
        }

        Console.WriteLine(
            "--------------------------------------------------------------"
        );

        // ============================================
        // SESSION SUMMARY
        // ============================================

        decimal totalTopUps = 0m;
        decimal totalBonuses = 0m;

        for (int i = 0; i < CustomerCount; i++)
        {
            totalTopUps += amounts[i];

            totalBonuses += networkBonuses[i]
                + extraBonuses[i];
        }

        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("                  SESSION SUMMARY");
        Console.WriteLine("==============================================================");
        Console.ResetColor();

        Console.WriteLine($"Customers processed: {CustomerCount}");
        Console.WriteLine($"Total top-ups:       {totalTopUps,12:N2} ETB");
        Console.WriteLine($"Total bonuses:       {totalBonuses,12:N2} ETB");

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("--------------------------------------------------------------");
        Console.WriteLine($"GRAND TOTAL CREDIT:  {grandTotal,12:N2} ETB");
        Console.WriteLine("==============================================================");
        Console.ResetColor();

        Console.WriteLine();
        Console.WriteLine("Thank you for using AddisEats Top-Up Console!");

        Console.WriteLine();
        Console.Write("Press Enter to return to the main menu...");
        Console.ReadLine();
    }
    else if (menuChoice == "2")
    {
        Console.Clear();

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("Thank you for using AddisEats!");
        Console.WriteLine("Goodbye!");
        Console.ResetColor();

        running = false;
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine();
        Console.WriteLine("Invalid menu option. Please select 1 or 2.");
        Console.ResetColor();

        Console.WriteLine();
        Console.Write("Press Enter to try again...");
        Console.ReadLine();
    }
}

Console.ResetColor();