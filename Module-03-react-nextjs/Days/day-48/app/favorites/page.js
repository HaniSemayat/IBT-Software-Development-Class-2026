import FavoritesPage from "./FavoritesPage";

export const metadata = {
  title: "Favorites",
  description: "Your saved Addis Eats dishes.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FavoritesPage />;
}
