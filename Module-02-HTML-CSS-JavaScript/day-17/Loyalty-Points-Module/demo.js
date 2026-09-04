const createLoyalty = require("./loyalty");


// Normal loyalty card

const card = createLoyalty();

card.earn(250);

console.log("Normal card after earning 250 ETB:");
console.log(card.balance());

card.redeem(10);

console.log("Normal card after redeeming 10 points:");
console.log(card.balance());


// Holiday loyalty card

const holidayRule = etb => Math.floor(etb / 10) * 2;

const holidayCard = createLoyalty(holidayRule);

holidayCard.earn(250);

console.log("Holiday card after earning 250 ETB:");
console.log(holidayCard.balance());


// Test independent balances

console.log("Normal card balance:");
console.log(card.balance());

console.log("Holiday card balance:");
console.log(holidayCard.balance());


// Test that redeem cannot go below zero

holidayCard.redeem(1000);

console.log("Holiday card after trying to redeem 1000 points:");
console.log(holidayCard.balance());