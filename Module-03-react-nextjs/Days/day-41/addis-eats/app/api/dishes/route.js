import { getDishes } from "../../../lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 3;

  const dishes = await getDishes();

  const filteredDishes = query
    ? dishes.filter((dish) =>
        dish.name.toLowerCase().includes(query)
      )
    : dishes;

  const start = (page - 1) * limit;
  const paginatedDishes = filteredDishes.slice(start, start + limit);

  return Response.json({
    dishes: paginatedDishes,
    page,
    totalPages: Math.ceil(filteredDishes.length / limit),
  });
}
