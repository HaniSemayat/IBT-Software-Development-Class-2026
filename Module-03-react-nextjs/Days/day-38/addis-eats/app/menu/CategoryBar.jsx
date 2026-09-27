export default function CategoryBar({ categories }) {
  return (
    <nav>
      {categories.map((category) => (
        <button key={category}>
          {category}
        </button>
      ))}
    </nav>
  );
}