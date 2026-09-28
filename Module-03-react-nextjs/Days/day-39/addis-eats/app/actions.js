"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  validateOrder,
} from "../lib/schema";

import {
  createOrder,
  getOrder,
  markCancelled,
} from "../lib/orders";

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

export async function cancelOrder(orderId) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    throw new Error("Not signed in");
  }

  const order = await getOrder(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== session.value) {
    throw new Error("Not yours");
  }

  await markCancelled(orderId);

  revalidatePath("/orders");
}