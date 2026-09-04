// Main application

import { transactions } from "./transactions.js";

import {
    totalByType,
    formatReceipts,
    updateTransaction
} from "./report.js";


// Calculate totals

const totalCredits = totalByType(transactions, "credit");
const totalDebits = totalByType(transactions, "debit");

console.log("=== TeleBirr Transaction Report ===");

console.log(`Credits: ${totalCredits} ETB`);
console.log(`Debits: ${totalDebits} ETB`);


// Format receipts

console.log("\n=== Receipts ===");

const receipts = formatReceipts(transactions);

receipts.forEach(receipt => {
    console.log(receipt);
});


// Test spread operator

console.log("\n=== Updated Transaction ===");

const originalTransaction = transactions[0];

const updatedTransaction = updateTransaction(
    originalTransaction,
    300
);

console.log("Original:");
console.log(originalTransaction);

console.log("Updated:");
console.log(updatedTransaction);