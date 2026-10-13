"use client";

import { useEffect, useState } from "react";
import MapPanel from "../../../components/tracking/MapPanel";

const TERMINAL_STATUSES = ["delivered", "cancelled"];

function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(String(status).toLowerCase());
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
        // EventSource reconnects automatically. Keep it open.
        setConnection("reconnecting");
      }
    };

    return () => {
      finished = true;
      source.close();
    };
  }, [id]);

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Order #{order.id}
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-800">
            {order.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Delivery Area:</strong> {order.area}
          </p>
          <p>
            <strong>Last updated:</strong>{" "}
            {new Date(order.createdAt).toLocaleString("en-ET", {
              timeZone: "Africa/Addis_Ababa",
            })}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
          <p aria-live="polite">
            <strong>Live updates:</strong>{" "}
            {connection === "connected" && "Connected"}
            {connection === "connecting" && "Connecting…"}
            {connection === "reconnecting" && "Connection interrupted; reconnecting…"}
            {connection === "complete" && "Tracking complete"}
            {connection === "stopped" && "Updates stopped"}
          </p>

          {streamError && (
            <p role="status" className="mt-2 text-amber-700">
              {streamError}
            </p>
          )}
        </div>
      </section>

      <MapPanel order={order} />
    </section>
  );
}