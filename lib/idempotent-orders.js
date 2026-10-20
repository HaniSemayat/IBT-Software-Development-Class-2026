import { createOrder } from "./orders";

const submissions =
  globalThis.__addisEatsOrderSubmissions ?? new Map();

if (!globalThis.__addisEatsOrderSubmissions) {
  globalThis.__addisEatsOrderSubmissions = submissions;
}

export async function createOrderOnce(order, submissionId) {
  if (
    typeof submissionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)
  ) {
    throw new Error("Invalid checkout submission ID.");
  }

  const key = `${order.userId}:${submissionId}`;
  const signature = JSON.stringify(order);
  const existing = submissions.get(key);

  if (existing) {
    if (existing.signature !== signature) {
      throw new Error("Submission ID reused with different order data.");
    }

    return existing.promise;
  }

  const promise = createOrder(order);
  submissions.set(key, { signature, promise });

  try {
    const createdOrder = await promise;

    submissions.set(key, {
      signature,
      promise: Promise.resolve(createdOrder),
    });

    return createdOrder;
  } catch (error) {
    submissions.delete(key);
    throw error;
  }
}