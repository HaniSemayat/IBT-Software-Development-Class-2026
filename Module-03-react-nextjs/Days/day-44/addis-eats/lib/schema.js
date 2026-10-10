import { dishes } from "./dishes";

export function validateOrder(order) {
  const fieldErrors = {};

  if (typeof order.name !== "string" || !order.name.trim()) {
    fieldErrors.name = "Name is required.";
  } else if (order.name.trim().length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }

  if (typeof order.phone !== "string" || !order.phone.trim()) {
    fieldErrors.phone = "Phone number is required.";
  } else if (!/^(?:\+251|0)9\d{8}$/.test(order.phone.trim())) {
    fieldErrors.phone = "Enter a valid Ethiopian phone number.";
  } else if (order.phone.trim() === "0911111111") {
    fieldErrors.phone = "This phone number cannot be used.";
  }

  if (typeof order.area !== "string" || !order.area.trim()) {
    fieldErrors.area = "Delivery area is required.";
  }

  return fieldErrors;
}

export function validateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      items: [],
      total: 0,
      error: "Your cart is empty. Add items before checking out.",
    };
  }

  const validatedItems = [];
  const seenIds = new Set();

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      !Number.isSafeInteger(item.id) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return {
        items: [],
        total: 0,
        error: "Your cart contains an invalid item or quantity.",
      };
    }

    const dish = dishes.find((entry) => entry.id === item.id);

    if (!dish || seenIds.has(dish.id)) {
      return {
        items: [],
        total: 0,
        error: "Your cart contains an unknown or duplicate dish.",
      };
    }

    seenIds.add(dish.id);

    validatedItems.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: item.quantity,
    });
  }

  const total = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items: validatedItems,
    total,
    error: null,
  };
}
