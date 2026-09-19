import PropTypes from "prop-types";

function Dish({ name, price, currency = "ETB", spicy = false, onAdd }) {
    return (
        <div className="dish">
            <h3>
                {name} {spicy && <span>• Spicy</span>}
            </h3>

            <p>
                {price} {currency}
            </p>

            <button onClick={onAdd}>Add</button>
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