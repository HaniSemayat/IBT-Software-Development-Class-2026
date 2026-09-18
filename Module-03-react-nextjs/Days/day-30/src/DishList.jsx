import Dish from "./Dish";
import Card from "./Card";

function DishList({ dishes, onAdd }) {
    if (dishes.length === 0) {
        return (
            <p className="empty">
                No dishes in this category yet.
            </p>
        );
    }

    return (
        <section className="menu">
            {dishes.map(function (dish) {
                return (
                    <Card key={dish.id}>
                        <Dish
                            name={dish.name}
                            price={dish.price}
                            spicy={dish.spicy}
                            onAdd={() => onAdd(dish)}
                        />
                    </Card>
                );
            })}
        </section>
    );
}

export default DishList;