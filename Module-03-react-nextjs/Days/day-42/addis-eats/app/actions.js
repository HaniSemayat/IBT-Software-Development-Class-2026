"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { validateOrder } from "../lib/schema";

import {
  createOrder,
  getOrderForUser,
  markCancelled,
} from "../lib/orders";

import { getUserByEmail } from "../lib/users";
import {
  createSession,
  destroySession,
  getSession,
} from "../lib/session";

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

export async function signOut() {
  await destroySession();

  redirect("/");
}

export async function placeOrder(previousState, formData) {
  const session = await getSession();

  if (!session) {
    throw new Error("Not signed in");
  }

  const order = {
    userId: session.id,
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
  const session = await getSession();

  if (!session) {
    throw new Error("Not signed in");
  }

  const order = await getOrderForUser(orderId, session.id);

  if (!order) {
    throw new Error("Order not found");
  }

  await markCancelled(orderId);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}
