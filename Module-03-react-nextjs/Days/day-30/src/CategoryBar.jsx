function CategoryBar({ selected, onSelect }) {
    const categories = [
        "All",
        "Ethiopian",
        "Pizza",
        "Burgers",
        "Drinks"
    ];

    return (
        <div className="category-bar">
            {categories.map(function (category) {
                return (
                    <button
                        key={category}
                        className={selected === category ? "active" : ""}
                        onClick={() => onSelect(category)}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}

export default CategoryBar;