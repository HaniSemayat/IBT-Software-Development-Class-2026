import { useEffect, useRef, useState } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { loadDishes } from "./api";

function Menu() {
    const [category, setCategory] = useState("All");
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const searchInputRef = useRef(null);

    function handleAdd(price) {
        setTotal(function (currentTotal) {
            return currentTotal + price;
        });
    }

    useEffect(() => {
        if (!loading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadMenu() {
            setLoading(true);
            setError(null);

            try {
                const loadedDishes = await loadDishes(
                    controller.signal,
                    category
                );

                setDishes(loadedDishes);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            } finally {
                    setLoading(false);
            }
        }

        loadMenu();

        return function () {
            controller.abort();
        };
    }, [category]);

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

            <input
                ref={searchInputRef}
                className="search-input"
                type="search"
                placeholder="Search dishes..."
                aria-label="Search dishes"
            />

            <DishList
                dishes={dishes}
                onAdd={handleAdd}
            />

            <h2 className="order-total">
                Order Total: {total} ETB
            </h2>
        </div>
    );
}

export default Menu;