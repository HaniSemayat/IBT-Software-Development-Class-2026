// Loyalty Points Module

function createLoyalty(earnRule = etb => Math.floor(etb / 10)) {

    // Private points balance
    let points = 0;

    return {

        // Earn points
        earn(etb) {
            points += earnRule(etb);
        },

        // Redeem points
        redeem(p) {
            points = Math.max(0, points - p);
        },

        // Get current balance
        balance() {
            return points;
        }
    };
}

module.exports = createLoyalty;