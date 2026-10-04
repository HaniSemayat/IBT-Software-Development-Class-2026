import { getDishes } from "../../../lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() || "";

  const dishes = await getDishes();

  const filteredDishes = query
    ? dishes.filter((dish) =>
        dish.name.toLowerCase().includes(query)
      )
    : dishes;

  return Response.json(filteredDishes);
}
