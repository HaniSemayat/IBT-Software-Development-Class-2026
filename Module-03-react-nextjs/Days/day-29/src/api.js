export async function loadDishes(signal, category) {
    const url =
        category === "All"
            ? "/dishes.json"
            : `/dishes.json?category=${encodeURIComponent(category)}`;

    const response = await fetch(url, {
        signal
    });

    if (!response.ok) {
        throw new Error("Could not load the menu. Please try again.");
    }

    const dishes = await response.json();

    if (category === "All") {
        return dishes;
    }

    return dishes.filter(function (dish) {
        return dish.category === category;
    });
}