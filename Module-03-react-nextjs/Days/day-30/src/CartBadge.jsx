import { useContext } from "react";
import CartContext from "./cart/CartContext";

function CartBadge() {
    const { items } = useContext(CartContext);

    return (
        <div className="cart-badge">
            Cart: {items.length}
        </div>
    );
}

export default CartBadge;