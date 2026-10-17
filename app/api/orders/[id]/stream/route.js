import { getOrderForUser } from "../../../../../lib/orders";
import { getSession } from "../../../../../lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 2000;
const HEARTBEAT_INTERVAL_MS = 15000;

function isTerminalStatus(status) {
  return ["delivered", "cancelled"].includes(
    String(status).toLowerCase()
  );
}

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const order = await getOrderForUser(id, session.id);

  if (!order) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const encoder = new TextEncoder();

  let closed = false;
  let polling = false;
  let lastSnapshot = JSON.stringify(order);
  let pollTimer;
  let heartbeatTimer;
  let controllerRef;

  function sendEvent(data) {
    if (closed) return;

    controllerRef.enqueue(
      encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
    );
  }

  function cleanup(closeController = true) {
    if (closed) return;

    closed = true;

    clearInterval(pollTimer);
    clearInterval(heartbeatTimer);
    request.signal.removeEventListener("abort", onAbort);

    if (closeController) {
      try {
        controllerRef.close();
      } catch {
        // The connection may already be closed.
      }
    }
  }

  function onAbort() {
    cleanup();
  }

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;

      request.signal.addEventListener("abort", onAbort, {
        once: true,
      });

      sendEvent({
        type: "order",
        order,
      });

      if (request.signal.aborted || isTerminalStatus(order.status)) {
        cleanup();
        return;
      }

      pollTimer = setInterval(async () => {
        if (closed || polling) return;

        polling = true;

        try {
          const latestOrder = await getOrderForUser(id, session.id);

          if (!latestOrder) {
            sendEvent({
              type: "error",
              message: "Order is no longer available.",
            });
            cleanup();
            return;
          }

          const snapshot = JSON.stringify(latestOrder);

          if (snapshot !== lastSnapshot) {
            lastSnapshot = snapshot;

            sendEvent({
              type: "order",
              order: latestOrder,
            });
          }

          if (isTerminalStatus(latestOrder.status)) {
            cleanup();
          }
        } catch {
          sendEvent({
            type: "error",
            message: "Unable to retrieve the latest order status.",
          });
          cleanup();
        } finally {
          polling = false;
        }
      }, POLL_INTERVAL_MS);

      heartbeatTimer = setInterval(() => {
        if (!closed) {
          controllerRef.enqueue(encoder.encode(": keepalive\n\n"));
        }
      }, HEARTBEAT_INTERVAL_MS);
    },

    cancel() {
      cleanup(false);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}