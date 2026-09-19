import { useMemo, useReducer } from "react";
import { cartReducer } from "./cartReducer";
import CartContext from "./CartContext";

function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: []
    });

    const total = state.items.reduce(function (sum, dish) {
        return sum + dish.price;
    }, 0);

    const value = useMemo(
        function () {
            return {
                items: state.items,
                dispatch,
                total
            };
        },
        [state.items, total]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;