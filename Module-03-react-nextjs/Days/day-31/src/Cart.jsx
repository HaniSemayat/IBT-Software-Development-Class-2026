import { useContext } from "react";
import { Link } from "react-router-dom";

import CartContext from "./cart/CartContext";

function Cart() {
    const {
        items,
        total,
        dispatch
    } = useContext(CartContext);

    return (
        <section>
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
                                        onClick={() =>
                                            dispatch({
                                                type: "remove",
                                                id: dish.id
                                            })
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
                        onClick={() =>
                            dispatch({
                                type: "clear"
                            })
                        }
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