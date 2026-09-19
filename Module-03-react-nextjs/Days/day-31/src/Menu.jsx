import {
    useContext,
    useMemo
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import useFetch from "./hooks/useFetch";
import CartContext from "./cart/CartContext";

function Menu() {
    const [searchParams, setSearchParams] = useSearchParams();

    const category =
        searchParams.get("category") || "All";

    const { data, loading, error } =
        useFetch("/dishes.json");

    const { dispatch } =
        useContext(CartContext);

    function handleCategoryChange(newCategory) {
        if (newCategory === "All") {
            setSearchParams({});
        } else {
            setSearchParams({
                category: newCategory
            });
        }
    }

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
            <h2>Full Menu</h2>

            <CategoryBar
                selected={category}
                onSelect={handleCategoryChange}
            />

            <DishList
                dishes={shownDishes}
                onAdd={handleAdd}
            />
        </div>
    );
}

export default Menu;