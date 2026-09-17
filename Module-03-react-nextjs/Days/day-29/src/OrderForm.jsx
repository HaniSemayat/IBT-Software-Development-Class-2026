import { useState } from "react";

function OrderForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        area: ""
    });

    const phoneIsValid =
        /^(?:\+251|0)9\d{8}$/.test(form.phone);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log(form);
    }

    return (
        <form className="order-form" onSubmit={handleSubmit}>
            <h2>TeleBirr Delivery</h2>

            <label>
                Name
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                TeleBirr Phone
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0911223344"
                    required
                />
            </label>

            <label>
                Area
                <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                />
            </label>

            {!phoneIsValid && form.phone !== "" && (
                <p className="error">
                    Enter a valid TeleBirr number.
                </p>
            )}

            <button type="submit" disabled={!phoneIsValid}>
                Place Order
            </button>
        </form>
    );
}

export default OrderForm;