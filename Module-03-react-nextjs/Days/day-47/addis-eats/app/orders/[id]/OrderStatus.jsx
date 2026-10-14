"use client";

import { useEffect, useState } from "react";
import MapPanel from "../../../components/tracking/MapPanel";

const TERMINAL_STATUSES = ["delivered", "cancelled"];

const STEPS = [
  { value: "placed", label: "Order placed", detail: "We received your order." },
  { value: "preparing", label: "Preparing", detail: "The kitchen is preparing your food." },
  { value: "ready", label: "Ready", detail: "Your order is ready to go." },
  { value: "out_for_delivery", label: "On the way", detail: "Your order is out for delivery." },
  { value: "delivered", label: "Delivered", detail: "Enjoy your meal!" },
];

function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(String(status).toLowerCase());
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-ET", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyle(status) {
  const styles = {
    placed: "bg-blue-50 text-blue-700 ring-blue-200",
    preparing: "bg-amber-50 text-amber-700 ring-amber-200",
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    out_for_delivery: "bg-orange-50 text-orange-700 ring-orange-200",
    delivered: "bg-green-50 text-green-700 ring-green-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  return styles[status] || "bg-stone-100 text-stone-700 ring-stone-200";
}

export default function OrderStatus({ id, initial }) {
  const [order, setOrder] = useState(initial);
  const [connection, setConnection] = useState("connecting");
  const [streamError, setStreamError] = useState("");

  useEffect(() => {
    const source = new EventSource(`/api/orders/${id}/stream`);
    let finished = false;

    source.onopen = () => {
      if (!finished) {
        setConnection("connected");
        setStreamError("");
      }
    };

    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "order" && message.order) {
          setOrder(message.order);
          setStreamError("");

          if (isTerminalStatus(message.order.status)) {
            finished = true;
            source.close();
            setConnection("complete");
          }
        }

        if (message.type === "error") {
          finished = true;
          source.close();
          setConnection("stopped");
          setStreamError(message.message || "The update stream stopped.");
        }
      } catch {
        setStreamError("Received an unreadable order update.");
      }
    };

    source.onerror = () => {
      if (!finished) {
        setConnection("reconnecting");
      }
    };

    return () => {
      finished = true;
      source.close();
    };
  }, [id]);

  const status = String(order.status || "placed").toLowerCase();
  const currentStep = STEPS.findIndex((step) => step.value === status);
  const cancelled = status === "cancelled";
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.total || 0);

  const connectionLabel = {
    connected: "Live updates connected",
    connecting: "Connecting to live updates...",
    reconnecting: "Connection interrupted; reconnecting...",
    complete: "Order tracking complete",
    stopped: "Live updates stopped",
  }[connection];

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-stone-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-sm font-medium text-stone-500">Order reference</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900">
              #{order.id}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-bold capitalize ring-1 ring-inset ${getStatusStyle(status)}`}
          >
            {status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <h3 className="text-lg font-bold text-stone-900">
            {cancelled ? "This order was cancelled" : "Order progress"}
          </h3>
          <p className="mt-1 text-sm leading-6 text-stone-500">
            {cancelled
              ? "This order will not continue through the delivery process."
              : STEPS[currentStep]?.detail || "Your order status will appear here."}
          </p>

          {!cancelled && (
            <ol className="mt-7 space-y-0">
              {STEPS.map((step, index) => {
                const complete = currentStep >= 0 && index < currentStep;
                const active = index === currentStep;
                const reached = complete || active;

                return (
                  <li key={step.value} className="flex gap-4">
                    <div className="flex w-8 shrink-0 flex-col items-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          complete
                            ? "bg-orange-600 text-white"
                            : active
                              ? "bg-orange-100 text-orange-700 ring-2 ring-orange-500"
                              : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {complete ? "✓" : index + 1}
                      </span>
                      {index < STEPS.length - 1 && (
                        <span
                          className={`my-1 min-h-7 w-0.5 flex-1 ${
                            complete ? "bg-orange-500" : "bg-stone-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-6 pt-1">
                      <p
                        className={`text-sm font-bold ${
                          reached ? "text-stone-900" : "text-stone-400"
                        }`}
                      >
                        {step.label}
                        {active && (
                          <span className="ml-2 text-xs font-semibold text-orange-600">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-stone-900">Delivery details</h3>

          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Customer
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {order.name || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Phone
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {order.phone || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Delivery area
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {order.area || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Last updated
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {formatDate(order.updatedAt)}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-stone-900">Your items</h3>

          {items.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              Item details are not available.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {items.map((item, index) => (
                <li
                  key={`${item.id ?? item.name ?? "item"}-${index}`}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div>
                    <p className="font-medium text-stone-800">
                      {item.name || "Menu item"}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Quantity: {item.quantity ?? 1}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
            <span className="font-semibold text-stone-600">Order total</span>
            <span className="text-xl font-extrabold text-orange-700">
              ETB {total.toLocaleString("en-ET")}
            </span>
          </div>
        </article>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <p aria-live="polite" className="flex items-center gap-2 text-sm text-stone-600">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connection === "connected"
                ? "bg-green-500"
                : connection === "reconnecting"
                  ? "bg-amber-500"
                  : connection === "complete"
                    ? "bg-stone-400"
                    : "bg-orange-500"
            }`}
          />
          {connectionLabel}
        </p>
        {streamError && (
          <p role="status" className="mt-2 text-sm text-amber-700">
            {streamError}
          </p>
        )}
      </div>

      <MapPanel order={order} />
    </section>
  );
}
