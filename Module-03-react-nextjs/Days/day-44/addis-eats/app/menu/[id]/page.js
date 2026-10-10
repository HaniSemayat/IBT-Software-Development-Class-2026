import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish, getDishes } from "../../../lib/dishes";
import AddToCartButton from "../../../components/AddToCartButton";

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const title = `${dish.name} — ${dish.price} ETB`;
  const description = `${dish.name} is available from Addis Eats for ${dish.price} ETB. Explore the menu and order food in Addis Ababa.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/menu/${dish.id}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const siteUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: `${dish.name} from Addis Eats.`,
    image: new URL(dish.image, siteUrl).toString(),
    offers: {
      "@type": "Offer",
      price: String(dish.price),
      priceCurrency: "ETB",
      availability: "https://schema.org/InStock",
      url: new URL(`/menu/${dish.id}`, siteUrl).toString(),
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link
        href="/menu"
        className="text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        Back to Menu
      </Link>

      <section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full bg-orange-50 sm:aspect-[16/9]">
          <Image
            src={dish.image}
            alt={dish.imageAlt}
            width={800}
            height={600}
            sizes="(max-width: 640px) calc(100vw - 3rem), 800px"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Addis Eats
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {dish.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {dish.price} ETB
          </p>

          <p className="mt-4 max-w-xl text-gray-600">
            Freshly prepared and ready to order from Addis Eats.
          </p>

          <div className="mt-8">
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </section>
    </main>
  );
}
