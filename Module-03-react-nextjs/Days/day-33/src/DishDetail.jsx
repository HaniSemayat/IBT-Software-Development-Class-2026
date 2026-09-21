import { useMemo } from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import useFetch from "./hooks/useFetch";
import { useCartStore } from "./cart/cartStore";

function DishDetail() {
    const { id } = useParams();

    const {
        data,
        loading,
        error
    } = useFetch("/dishes.json");

    const addItem = useCartStore(
        (state) => state.addItem
    );

    const dish = useMemo(
        function () {
            const dishes = data ?? [];

            return dishes.find(function (item) {
                return String(item.id) === id;
            });
        },
        [data, id]
    );

    function handleAdd() {
        addItem(dish);
    }

    if (loading) {
        return (
            <p className="status">
                Loading dish...
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

    if (!dish) {
        return (
            <section>
                <h2>Dish not found</h2>

                <p>
                    We could not find that dish.
                </p>

                <Link to="/menu">
                    Back to Menu
                </Link>
            </section>
        );
    }

    return (
        <section>
            <h2>{dish.name}</h2>

            <p>
                Price: {dish.price} ETB
            </p>

            {dish.spicy && (
                <p>• Spicy</p>
            )}

            <button onClick={handleAdd}>
                Add to Cart
            </button>

            <p>
                <Link to="/menu">
                    Back to Menu
                </Link>
            </p>
        </section>
    );
}

export default DishDetail;