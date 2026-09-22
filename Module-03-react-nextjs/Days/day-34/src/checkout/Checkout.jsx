import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartStore } from "../cart/cartStore";
import useAuth from "../auth/useAuth";

import Field from "./Field";
import validate from "./validate";

import { placeOrder } from "../api/orders";

function Checkout() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const items = useCartStore(
        (state) => state.items
    );

    const clear = useCartStore(
        (state) => state.clear
    );

    const total = useCartStore(
        (state) =>
            state.items.reduce(
                function (sum, dish) {
                    return sum + dish.price;
                },
                0
            )
    );

    const [form, setForm] = useState({
        name: "",
        phone: user?.phone || "",
        area: "Bole",
        notes: ""
    });

    const [touched, setTouched] =
        useState({});

    const [submitting, setSubmitting] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    const [serverErrors, setServerErrors] =
        useState({});

    const errors = validate(form);

    const hasErrors =
        Object.keys(errors).length > 0;

    function showError(field) {
        return touched[field] && errors[field];
    }

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setForm(function (current) {
            return {
                ...current,
                [name]: value
            };
        });

        setServerErrors(function (current) {
            return {
                ...current,
                [name]: ""
            };
        });

        setSubmitError("");
    }

    function handleBlur(event) {
        const { name } = event.target;

        setTouched(function (current) {
            return {
                ...current,
                [name]: true
            };
        });
    }

    function focusFirstInvalid() {
        const firstError =
            Object.keys(errors)[0];

        if (!firstError) {
            return;
        }

        const element =
            document.getElementById(
                firstError
            );

        if (element) {
            element.focus();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setTouched({
            name: true,
            phone: true,
            area: true,
            notes: true
        });

        setSubmitError("");
        setServerErrors({});

        if (hasErrors) {
            focusFirstInvalid();
            return;
        }

        if (submitting) {
            return;
        }

        setSubmitting(true);

        try {
            const result =
                await placeOrder({
                    ...form,
                    items: items,
                    total: total
                });

            clear();

            navigate("/receipt", {
                state: {
                    order: result.order
                }
            });
        } catch (error) {
            if (
                error.status === 422 &&
                error.fieldErrors
            ) {
                setSubmitError(
                    "Please correct the highlighted order details."
                );

                setServerErrors(
                    error.fieldErrors
                );

                setTouched(function (current) {
                    return {
                        ...current,
                        ...Object.keys(
                            error.fieldErrors
                        ).reduce(
                            function (
                                result,
                                field
                            ) {
                                result[field] =
                                    true;

                                return result;
                            },
                            {}
                        )
                    };
                });

                const firstServerError =
                    Object.keys(
                        error.fieldErrors
                    )[0];

                if (firstServerError) {
                    const element =
                        document.getElementById(
                            firstServerError
                        );

                    if (element) {
                        element.focus();
                    }
                }
            } else {
                setSubmitError(
                    "We could not place your order. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (items.length === 0) {
        return (
            <section className="checkout">
                <h2>Checkout</h2>

                <p>
                    Your cart is empty.
                </p>

                <p>
                    <a href="/menu">
                        Browse Menu
                    </a>
                </p>
            </section>
        );
    }

    return (
        <section className="checkout">
            <h2>Checkout</h2>

            {submitError && (
                <p
                    className="error"
                    role="alert"
                >
                    {submitError}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
            >
                <Field
                    id="name"
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        showError("name") ||
                        serverErrors.name
                    }
                    placeholder="Your name"
                />

                <Field
                    id="phone"
                    label="TeleBirr Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        showError("phone") ||
                        serverErrors.phone
                    }
                    placeholder="09XXXXXXXX"
                />

                <Field
                    id="area"
                    label="Delivery Area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        showError("area") ||
                        serverErrors.area
                    }
                    placeholder="Delivery area"
                />

                <Field
                    id="notes"
                    label="Notes (optional)"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        showError("notes") ||
                        serverErrors.notes
                    }
                    placeholder="Any delivery instructions?"
                    as="textarea"
                />

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? "Placing order..."
                        : `Place Order — ${total} ETB`}
                </button>
            </form>
        </section>
    );
}

export default Checkout;