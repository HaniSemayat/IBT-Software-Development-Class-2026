import PropTypes from "prop-types";

const TEST_MENU_ERROR = false;

function Dish({
    name,
    price,
    currency = "ETB",
    spicy = false,
    onAdd
}) {
    if (
        TEST_MENU_ERROR &&
        name === "Doro Wet"
    ) {
        throw new Error(
            "Deliberate menu error for testing ErrorBoundary."
        );
    }

    return (
        <div className="dish">
            <h3>
                {name}{" "}
                {spicy && (
                    <span>• Spicy</span>
                )}
            </h3>

            <p>
                {price} {currency}
            </p>

            <button
                type="button"
                onClick={onAdd}
            >
                Add
            </button>
        </div>
    );
}

Dish.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string,
    spicy: PropTypes.bool,
    onAdd: PropTypes.func.isRequired
};

export default Dish;