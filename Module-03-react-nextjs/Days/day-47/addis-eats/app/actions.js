"use server";

import { createUser, getUserByEmail } from "../lib/users";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { validateOrder, validateCartItems } from "../lib/schema";

import {
  createOrder,
  getOrderForUser,
  markCancelled,
  setOrderStatus,
} from "../lib/orders";

import {
  createSession,
  destroySession,
  getSession,
} from "../lib/session";


export async function signUp(previousState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80
  ) {
    return {
      error: "Name must be between 2 and 80 characters.",
      success: false,
    };
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return {
      error: "Enter a valid email address.",
      success: false,
    };
  }

  if (typeof password !== "string" || password.length < 8) {
    return {
      error: "Password must contain at least 8 characters.",
      success: false,
    };
  }

  const result = await createUser({ name, email, password });

  if (result.error) {
    return { error: result.error, success: false };
  }

  redirect("/signin?registered=1");
}


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

    const safeNext =
      typeof next === "string" &&
      next.startsWith("/") &&
      !next.startsWith("//") &&
      !next.includes("\\") &&
      !/[\r\n]/.test(next)
        ? next
        : "/";

    const destination =
      user.role === "staff" && safeNext === "/"
        ? "/admin"
        : safeNext;

    redirect(destination);
}

export async function signOut() {
  await destroySession();

  redirect("/");
}

export async function placeOrder(previousState, formData) {
  const session = await getSession();

  if (!session) {
    return {
      error: "Please sign in before placing an order.",
      fieldErrors: {},
    };
  }

  let submittedItems;

  try {
    submittedItems = JSON.parse(formData.get("cartItems") || "[]");
  } catch {
    return {
      error: "Your cart data is invalid. Please review your cart.",
      fieldErrors: {},
    };
  }

  const validatedCart = validateCartItems(submittedItems);

  if (validatedCart.error) {
    return {
      error: validatedCart.error,
      fieldErrors: {},
    };
  }

  const order = {
    userId: session.id,
    name: formData.get("name"),
    phone: formData.get("phone"),
    area: formData.get("area"),
    notes: formData.get("notes"),
    items: validatedCart.items,
    total: validatedCart.total,
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
  revalidatePath("/orders");

  return {
    success: true,
    order: createdOrder,
    fieldErrors: {},
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



export async function updateOrderStatus(formData) {
  const session = await getSession();

  if (!session || session.role !== "staff") {
    throw new Error("Only authorized staff can update order status.");
  }

  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (typeof orderId !== "string" || !/^\d+$/.test(orderId)) {
    throw new Error("Invalid order ID.");
  }

  await setOrderStatus(orderId, status);

  const { getOrder } = await import("../lib/orders");
  const updatedOrder = await getOrder(orderId);

  if (!updatedOrder) {
    throw new Error("Order not found.");
  }

  revalidatePath("/kitchen");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}