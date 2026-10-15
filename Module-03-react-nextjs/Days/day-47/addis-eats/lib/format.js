const etbFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export function formatETB(amount) {
  return etbFormatter.format(Number(amount) || 0);
}

export function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return dateFormatter.format(date);
}

export function formatRelativeTime(value, now = Date.now()) {
  if (!value) return "—";

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return "—";

  const seconds = Math.round((timestamp - now) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, duration] of units) {
    if (Math.abs(seconds) >= duration || unit === "second") {
      return relativeFormatter.format(Math.round(seconds / duration), unit);
    }
  }
}
