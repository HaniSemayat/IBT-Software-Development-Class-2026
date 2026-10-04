const orders = globalThis.__addisEatsOrders ?? [];

if (!globalThis.__addisEatsOrders) {
  globalThis.__addisEatsOrders = orders;
}

export async function createOrder(order) {
  const newOrder = {
    id: orders.length + 1,
    userId: "demo-user",
    status: "placed",
    ...order,
  };

  orders.push(newOrder);

  return newOrder;
}

export async function getOrder(orderId) {
  return orders.find(
    (order) => order.id === Number(orderId)
  );
}

export async function markCancelled(orderId) {
  const order = await getOrder(orderId);

  if (order) {
    order.status = "cancelled";
  }

  return order;
}
