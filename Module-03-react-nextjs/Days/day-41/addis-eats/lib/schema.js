export function validateOrder(order) {
  const fieldErrors = {};

  if (!order.name?.trim()) {
    fieldErrors.name = "Name is required.";
  } else if (order.name.trim().length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }

  if (!order.phone?.trim()) {
    fieldErrors.phone = "Phone number is required.";
  } else if (
    !/^(?:\+251|0)9\d{8}$/.test(order.phone.trim())
  ) {
    fieldErrors.phone =
      "Enter a valid Ethiopian phone number.";
  } else if (order.phone.trim() === "0911111111") {
    fieldErrors.phone =
      "This phone number cannot be used.";
  }

  if (!order.area?.trim()) {
    fieldErrors.area = "Delivery area is required.";
  }

  return fieldErrors;
}