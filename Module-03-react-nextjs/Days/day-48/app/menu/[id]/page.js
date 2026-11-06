
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
      images: [dish.image],
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
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/menu"
          className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Back to Menu
        </Link>
      </nav>

      <article className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft md:aspect-auto md:min-h-[440px]">
            <Image
              src={dish.image}
              alt={dish.imageAlt || dish.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
                {dish.category}
              </span>

              <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted">
                Made for Addis Ababa
              </span>
            </div>

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Addis Eats
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {dish.name}
            </h1>

            <p className="mt-5 leading-7 text-muted">
              Discover {dish.name}, available to order from Addis Eats.
              Find your next favorite and enjoy a delicious meal.
            </p>

            <div className="mt-8 border-y border-border py-5">
              <p className="text-sm font-medium text-muted">Price</p>
              <p className="mt-1 text-3xl font-bold text-brand">
                {dish.price} ETB
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AddToCartButton dish={dish} />

              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Continue Browsing
              </Link>
            </div>

            <p className="mt-5 text-xs leading-5 text-muted">
              Prices are displayed in Ethiopian birr (ETB).
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
