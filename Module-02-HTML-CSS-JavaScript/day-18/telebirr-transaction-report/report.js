// Report functions

export const totalByType = (txns, type) => {

    return txns
        .filter(transaction => transaction.type === type)
        .reduce((sum, { amount }) => sum + amount, 0);
};


export const formatReceipts = (txns) => {

    return txns.map(({ customer, amount }) => {
        return `${customer}: ${amount} ETB`;
    });
};


export const updateTransaction = (transaction, newAmount) => {

    return {
        ...transaction,
        amount: newAmount
    };
};