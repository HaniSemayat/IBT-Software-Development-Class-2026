import { useContext } from "react";
import { Link } from "react-router-dom";

import CartContext from "./cart/CartContext";

function Checkout() {
    const {
        items,
        total,
        dispatch
    } = useContext(CartContext);

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

                    <button
                        onClick={() =>
                            dispatch({
                                type: "clear"
                            })
                        }
                    >
                        Place Order
                    </button>
                </>
            )}
        </section>
    );
}

export default Checkout;