const orders = globalThis.__addisEatsOrders ?? [];

if (!globalThis.__addisEatsOrders) {
  globalThis.__addisEatsOrders = orders;
}

export async function createOrder(order) {
  const newOrder = {
    id: orders.length + 1,
    status: "placed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...order,
  };

  orders.push(newOrder);
  return newOrder;
}

export async function getOrder(orderId) {
  return orders.find((order) => order.id === Number(orderId)) ?? null;
}

export async function getOrdersByUser(userId) {
  return orders.filter((order) => order.userId === userId);
}

export async function getOrderForUser(orderId, userId) {
  const order = await getOrder(orderId);

  if (!order || order.userId !== userId) {
    return null;
  }

  return order;
}

export async function markCancelled(orderId) {
  const order = await getOrder(orderId);

  if (order) {
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
  }

  return order;
}

export async function getDashboardAnalytics() {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (6 - index));

    return {
      date: date.toISOString().slice(0, 10),
      orders: 0,
    };
  });

  const dailyOrders = new Map(days.map((day) => [day.date, day.orders]));
  const revenueByArea = new Map();

  const statusLabels = [
    { status: "placed", label: "Placed" },
    { status: "preparing", label: "Preparing" },
    { status: "ready", label: "Ready" },
    { status: "out_for_delivery", label: "Out for delivery" },
    { status: "delivered", label: "Delivered" },
    { status: "cancelled", label: "Cancelled" },
  ];

  const statusCounts = new Map(
    statusLabels.map(({ status }) => [status, 0])
  );

  for (const order of orders) {
    if (statusCounts.has(order.status)) {
      statusCounts.set(
        order.status,
        statusCounts.get(order.status) + 1
      );
    }

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toISOString().slice(0, 10)
      : null;

    if (orderDate && dailyOrders.has(orderDate)) {
      dailyOrders.set(orderDate, dailyOrders.get(orderDate) + 1);
    }

    if (order.status === "cancelled") {
      continue;
    }

    const area =
      typeof order.area === "string" && order.area.trim()
        ? order.area.trim()
        : "Unknown area";

    revenueByArea.set(
      area,
      (revenueByArea.get(area) ?? 0) + Number(order.total || 0)
    );
  }

  const revenue = Array.from(revenueByArea, ([area, total]) => ({
    area,
    total,
  })).sort((a, b) => b.total - a.total);

  const ordersOverTime = days.map((day) => ({
    date: day.date,
    orders: dailyOrders.get(day.date),
  }));

  const statusBreakdown = statusLabels.map(({ status, label }) => ({
    status,
    label,
    count: statusCounts.get(status),
  }));

  return {
    revenue,
    ordersOverTime,
    statusBreakdown,
    dateRange: {
      start: days[0].date,
      end: days[days.length - 1].date,
    },
    totalOrders: orders.length,
    totalRevenue: revenue.reduce((sum, item) => sum + item.total, 0),
  };
}


export async function getAllOrders() {
  return [...orders].sort((a, b) => b.id - a.id);
}

export async function setOrderStatus(orderId, status) {
  const allowedStatuses = [
    "placed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status.");
  }

  const order = await getOrder(orderId);

  if (!order) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  return order;
}