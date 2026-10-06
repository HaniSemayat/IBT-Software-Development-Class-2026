import { getSession } from "../../../../lib/session";
import { getOrderForUser } from "../../../../lib/orders";

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const order = await getOrderForUser(id, session.id);

  if (!order) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json(order, { status: 200 });
}
