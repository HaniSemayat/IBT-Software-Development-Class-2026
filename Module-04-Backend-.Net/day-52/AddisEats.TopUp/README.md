
# AddisEats Top-Up Console

A C# console-based mobile top-up calculator developed for
CodeOps Module 4 - Backend .NET Track.

## Features

- Interactive console menu and colored interface.
- Processes five customer top-up transactions per session.
- Supports Ethio Telecom, Safaricom, and other networks.
- Calculates network-specific bonuses.
- Awards an additional 20 ETB for top-ups of 1,000 ETB or more.
- Validates customer names and top-up amounts.
- Displays a formatted transaction report and grand total.

## Bonus Rules

| Network | Bonus |
|---|---:|
| Ethio Telecom | 5% |
| Safaricom | 3% |
| Other | 0% |

Additional bonus: 20 ETB for top-ups >= 1,000 ETB.

Maximum top-up: 5,000 ETB.

## Technologies

- C#
- .NET 8
- .NET Console Application

## Concepts Practiced

- Variables and data types
- Arrays
- For and while loops
- Switch expressions
- Conditional statements
- Decimal arithmetic
- Input validation using TryParse()
- Console formatting and colors

## How to Run

Make sure .NET 8 SDK is installed.

```powershell
dotnet restore
dotnet run
```

## Project Structure

```text
AddisEats.TopUp/
├── Program.cs
├── AddisEats.TopUp.csproj
└── README.md
```

## Author

CodeOps Module 4 - .NET Track
Hani Tsehaye
