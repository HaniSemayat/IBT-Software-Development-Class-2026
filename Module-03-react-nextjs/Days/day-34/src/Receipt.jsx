import { Link, useLocation } from "react-router-dom";

function Receipt() {
    const location = useLocation();

    const order = location.state?.order;

    if (!order) {
        return (
            <section className="checkout">
                <h2>No Receipt Found</h2>

                <p>
                    There is no recent order to display.
                </p>

                <Link to="/menu">
                    Back to Menu
                </Link>
            </section>
        );
    }

    return (
        <section className="checkout">
            <h2>Order Receipt</h2>

            <p>
                <strong>Name:</strong>{" "}
                {order.name}
            </p>

            <p>
                <strong>Phone:</strong>{" "}
                {order.phone}
            </p>

            <p>
                <strong>Delivery Area:</strong>{" "}
                {order.area}
            </p>

            {order.notes && (
                <p>
                    <strong>Notes:</strong>{" "}
                    {order.notes}
                </p>
            )}

            <h3>
                Total: {order.total} ETB
            </h3>

            <h3>Items</h3>

            <ul>
                {order.items.map(
                    function (item, index) {
                        return (
                            <li
                                key={`${item.id}-${index}`}
                            >
                                {item.name} —{" "}
                                {item.price} ETB
                            </li>
                        );
                    }
                )}
            </ul>

            <p>
                Thank you for ordering
                from Addis Eats!
            </p>

            <Link to="/menu">
                Order More Food
            </Link>
        </section>
    );
}

export default Receipt;