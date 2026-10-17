import { NextResponse } from "next/server";
import { getDishes } from "../../../lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "All";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = 3;

  let filtered = await getDishes();

  if (category !== "All") {
    filtered = filtered.filter((dish) => dish.category === category);
  }

  if (query) {
    filtered = filtered.filter((dish) =>
      dish.name.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return NextResponse.json({
    dishes: filtered.slice(start, start + limit),
    page: safePage,
    totalPages,
  });
}

