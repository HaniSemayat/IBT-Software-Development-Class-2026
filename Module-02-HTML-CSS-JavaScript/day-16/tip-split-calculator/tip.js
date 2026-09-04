// Day 16 - TeleBirr Tip & Split Calculator

const bill = Number(400);
const partySize = Number(4);
const paymentMethod = "TeleBirr";

// Choose tip rate
let tipRate;

if (bill > 300) {
    tipRate = 0.10;
} else {
    tipRate = 0.05;
}

// Calculate tip and total
const tip = bill * tipRate;
const total = bill + tip;

// Split the bill
const perPerson = total / partySize;

// Choose service fee
let serviceFee;

switch (paymentMethod) {
    case "TeleBirr":
        serviceFee = 5;
        break;

    case "CBE Birr":
        serviceFee = 3;
        break;

    default:
        serviceFee = 0;
}

// Calculate final amounts
const finalTotal = total + serviceFee;
const finalPerPerson = finalTotal / partySize;

// Display results
console.log(`Bill: ${bill} ETB`);
console.log(`Tip: ${tip} ETB`);
console.log(`Service fee: ${serviceFee} ETB`);
console.log(`Final total: ${finalTotal} ETB`);
console.log(`Each person pays: ${finalPerPerson} ETB`);