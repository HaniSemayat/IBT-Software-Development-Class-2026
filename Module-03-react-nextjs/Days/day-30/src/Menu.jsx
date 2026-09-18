import { useContext, useMemo, useState } from "react";

import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import useFetch from "./hooks/useFetch";
import CartContext from "./cart/CartContext";

function Menu() {
    const [category, setCategory] = useState("All");

    const { data, loading, error } = useFetch("/dishes.json");

    const { dispatch } = useContext(CartContext);

    const shownDishes = useMemo(
        function () {
            const dishes = data ?? [];

            if (category === "All") {
                return dishes;
            }

            return dishes.filter(function (dish) {
                return dish.category === category;
            });
        },
        [data, category]
    );

    function handleAdd(dish) {
        dispatch({
            type: "add",
            dish: dish
        });
    }

    if (loading) {
        return (
            <p className="status">
                Loading the menu...
            </p>
        );
    }

    if (error) {
        return (
            <p className="error">
                {error}
            </p>
        );
    }

    return (
        <div>
            <CategoryBar
                selected={category}
                onSelect={setCategory}
            />

            <DishList
                dishes={shownDishes}
                onAdd={handleAdd}
            />
        </div>
    );
}

export default Menu;