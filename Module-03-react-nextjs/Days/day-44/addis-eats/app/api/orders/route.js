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

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must contain valid JSON." },
      { status: 400 }
    );
  }

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

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

  try {
    const createdOrder = await createOrder(order);

    return Response.json(createdOrder, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to create the order." },
      { status: 500 }
    );
  }
}
