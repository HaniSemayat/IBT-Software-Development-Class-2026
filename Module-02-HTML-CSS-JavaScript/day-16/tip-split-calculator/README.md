# TeleBirr Tip & Split Calculator

A simple JavaScript calculator that calculates a restaurant bill, applies a tiered tip, adds a mobile payment service fee, and splits the final amount between a group.

## Requirements

- Bill amount is converted using `Number()`
- Bills over 300 ETB receive a 10% tip
- Bills of 300 ETB or less receive a 5% tip
- The bill is divided among the party
- A `switch` statement selects the TeleBirr or CBE Birr service fee
- Results are displayed using template literals

## Example

For a 400 ETB bill with 4 people using TeleBirr:

- Bill: 400 ETB
- Tip: 40 ETB
- Service fee: 5 ETB
- Final total: 445 ETB
- Each person pays: 111.25 ETB

## How to Run

Make sure Node.js is installed.

Run:

```bash
node tip.js