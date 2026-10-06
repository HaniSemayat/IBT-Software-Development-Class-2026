"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { validateOrder } from "../lib/schema";

import {
  createOrder,
  getOrder,
  markCancelled,
} from "../lib/orders";

import { getUserByEmail } from "../lib/users";
import { createSession } from "../lib/session";

export async function signIn(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next") || "/";

  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    return {
      error: "Invalid email or password.",
      success: false,
    };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  if (!next.startsWith("/") || next.startsWith("//")) {
    redirect("/");
  }

  redirect(next);
}

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

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== session.value) {
    throw new Error("Not yours");
  }

  await markCancelled(orderId);

  revalidatePath("/orders");
}
