import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";

function Cart() {
    const items = useCartStore(
        (state) => state.items
    );

    const total = useCartStore(
        (state) =>
            state.items.reduce(function (sum, dish) {
                return sum + dish.price;
            }, 0)
    );

    const remove = useCartStore(
        (state) => state.remove
    );

    const clear = useCartStore(
        (state) => state.clear
    );

    return (
        <section className="checkout">
            <h2>Your Cart</h2>

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

                                    <button
                                        type="button"
                                        onClick={() =>
                                            remove(index)
                                        }
                                    >
                                        Remove
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <h3>
                        Total: {total} ETB
                    </h3>

                    <button
                        type="button"
                        onClick={clear}
                    >
                        Clear Cart
                    </button>

                    <p>
                        <Link to="/checkout">
                            Proceed to Checkout
                        </Link>
                    </p>
                </>
            )}
        </section>
    );
}

export default Cart;