import { getSession } from "../../../lib/session";
import { validateOrder } from "../../../lib/schema";
import { createOrder } from "../../../lib/orders";

export async function POST(request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const order = {
    userId: session.id,
    name: body.name,
    phone: body.phone,
    area: body.area,
    notes: body.notes,
    items: body.items ?? [],
    total: body.total ?? 0,
  };

  const fieldErrors = validateOrder(order);

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      {
        error: "Validation failed",
        fieldErrors,
      },
      { status: 422 }
    );
  }

  const createdOrder = await createOrder(order);

  return Response.json(createdOrder, { status: 201 });
}
