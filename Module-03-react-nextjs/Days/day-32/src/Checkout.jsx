import { Link } from "react-router-dom";
import { useCartStore } from "./cart/cartStore";

function Checkout() {
    const items = useCartStore(
        (state) => state.items
    );

    const total = useCartStore(
        (state) =>
            state.items.reduce(function (sum, dish) {
                return sum + dish.price;
            }, 0)
    );

    const clear = useCartStore(
        (state) => state.clear
    );

    return (
        <section className="checkout">
            <h2>Checkout</h2>

            {items.length === 0 ? (
                <>
                    <p>Your cart is empty.</p>

                    <Link to="/menu">
                        Browse Menu
                    </Link>
                </>
            ) : (
                <>
                    <ul>
                        {items.map(function (dish, index) {
                            return (
                                <li
                                    key={`${dish.id}-${index}`}
                                >
                                    {dish.name} - {dish.price} ETB
                                </li>
                            );
                        })}
                    </ul>

                    <h3>
                        Total: {total} ETB
                    </h3>

                    <button onClick={clear}>
                        Place Order
                    </button>
                </>
            )}
        </section>
    );
}

export default Checkout;