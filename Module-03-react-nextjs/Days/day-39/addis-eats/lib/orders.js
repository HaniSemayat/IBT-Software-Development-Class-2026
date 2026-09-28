let orders = [];

export async function createOrder(order) {
  const newOrder = {
    id: orders.length + 1,
    ...order
  };

  orders.push(newOrder);

  return newOrder;
}