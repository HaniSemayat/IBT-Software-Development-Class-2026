import Dish from "./Dish.jsx";
import Card from "./Card.jsx";

function Menu({ dishes, category }) {
    const filteredDishes = dishes.filter(function (dish) {
        return dish.category === category;
    });

    if (filteredDishes.length === 0) {
        return <p>No dishes found in this category.</p>;
    }

    return (
        <section className="menu">
            {filteredDishes.map(function (dish) {
                return (
                    <Card key={dish.id}>
                        <Dish
                            name={dish.name}
                            price={dish.price}
                            spicy={dish.spicy}
                        />
                    </Card>
                );
            })}
        </section>
    );
}

export default Menu;