import { getOrdersByUser } from "../../../../lib/orders";
import { getSession } from "../../../../lib/session";

function escapeCSV(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const orders = await getOrdersByUser(session.id);

  const headers = [
    "Order ID",
    "Status",
    "Created At",
    "Customer",
    "Phone",
    "Delivery Area",
    "Items",
    "Total (ETB)",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.status,
    order.createdAt,
    order.name,
    order.phone,
    order.area,
    (order.items ?? [])
      .map((item) => `${item.name} x ${item.quantity}`)
      .join("; "),
    order.total,
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="addis-eats-orders.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
