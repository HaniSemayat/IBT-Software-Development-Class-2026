import { getDishes } from "../lib/dishes";

export default async function sitemap() {
  const baseUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );
  const dishes = await getDishes();

  return [
    {
      url: new URL("/", baseUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/menu", baseUrl).toString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...dishes.map((dish) => ({
      url: new URL(`/menu/${dish.id}`, baseUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
