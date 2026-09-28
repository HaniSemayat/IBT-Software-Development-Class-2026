"use server";

import { revalidatePath } from "next/cache";
import { validateOrder } from "../lib/schema";
import { createOrder } from "../lib/orders";

export async function placeOrder(previousState, formData) {
  const order = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    area: formData.get("area"),
    notes: formData.get("notes"),
    items: [],
    total: 0,
  };

  const fieldErrors = validateOrder(order);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Validation failed",
      fieldErrors,
    };
  }

  const createdOrder = await createOrder(order);

  revalidatePath("/checkout");

  return {
    success: true,
    order: createdOrder,
  };
}