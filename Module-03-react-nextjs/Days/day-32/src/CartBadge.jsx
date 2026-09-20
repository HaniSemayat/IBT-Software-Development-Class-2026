import { useCartStore } from "./cart/cartStore";

function CartBadge() {
    const itemCount = useCartStore(
        (state) => state.items.length
    );

    return (
        <div className="cart-badge">
            Cart: {itemCount}
        </div>
    );
}

export default CartBadge;