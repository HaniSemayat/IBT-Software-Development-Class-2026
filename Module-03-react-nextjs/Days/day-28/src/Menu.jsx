import { useState } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

function Menu({ dishes }) {
    const [category, setCategory] = useState("All");
    const [total, setTotal] = useState(0);

    const shownDishes =
        category === "All"
            ? dishes
            : dishes.filter(function (dish) {
                  return dish.category === category;
              });

    function handleAdd(price) {
        setTotal(function (currentTotal) {
            return currentTotal + price;
        });
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

            <h2 className="order-total">
                Order Total: {total} ETB
            </h2>
        </div>
    );
}

export default Menu;