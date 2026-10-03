import { validateOrder } from "../../../lib/schema";
import { createOrder } from "../../../lib/orders";

export async function POST(request) {
  const body = await request.json();

  const fieldErrors = validateOrder(body);

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      {
        error: "Validation failed",
        fieldErrors
      },
      { status: 422 }
    );
  }

  const order = await createOrder(body);

  return Response.json(order, { status: 201 });
}