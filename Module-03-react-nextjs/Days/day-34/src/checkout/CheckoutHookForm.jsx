import { useForm } from "react-hook-form";

import { useCartStore } from "../cart/cartStore";
import useAuth from "../auth/useAuth";

function CheckoutHookForm() {
    const { user } = useAuth();

    const items = useCartStore(
        (state) => state.items
    );

    const clear = useCartStore(
        (state) => state.clear
    );

    const total = useCartStore(
        (state) =>
            state.items.reduce(function (sum, dish) {
                return sum + dish.price;
            }, 0)
    );

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm({
        defaultValues: {
            name: "",
            phone: user?.phone || "",
            area: "Bole",
            notes: ""
        }
    });

    async function onSubmit(data) {
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });

        console.log({
            ...data,
            items: items,
            total: total
        });

        clear();
    }

    if (items.length === 0) {
        return (
            <section>
                <h2>Checkout with React Hook Form</h2>
                <p>Your cart is empty.</p>
            </section>
        );
    }

    return (
        <section>
            <h2>
                Checkout with React Hook Form
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-field">
                    <label htmlFor="rhf-name">
                        Name
                    </label>

                    <input
                        id="rhf-name"
                        {...register("name", {
                            required:
                                "Name is required.",
                            minLength: {
                                value: 2,
                                message:
                                    "Name must be at least 2 characters."
                            }
                        })}
                        aria-invalid={
                            !!errors.name
                        }
                        aria-describedby={
                            errors.name
                                ? "rhf-name-error"
                                : undefined
                        }
                    />

                    {errors.name && (
                        <p
                            id="rhf-name-error"
                            role="alert"
                        >
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="rhf-phone">
                        TeleBirr Phone
                    </label>

                    <input
                        id="rhf-phone"
                        type="tel"
                        {...register("phone", {
                            required:
                                "Phone number is required.",
                            pattern: {
                                value:
                                    /^(?:\+251|0)9\d{8}$/,
                                message:
                                    "Enter a valid Ethiopian phone number."
                            }
                        })}
                        aria-invalid={
                            !!errors.phone
                        }
                        aria-describedby={
                            errors.phone
                                ? "rhf-phone-error"
                                : undefined
                        }
                    />

                    {errors.phone && (
                        <p
                            id="rhf-phone-error"
                            role="alert"
                        >
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="rhf-area">
                        Delivery Area
                    </label>

                    <input
                        id="rhf-area"
                        {...register("area", {
                            required:
                                "Delivery area is required."
                        })}
                        aria-invalid={
                            !!errors.area
                        }
                        aria-describedby={
                            errors.area
                                ? "rhf-area-error"
                                : undefined
                        }
                    />

                    {errors.area && (
                        <p
                            id="rhf-area-error"
                            role="alert"
                        >
                            {errors.area.message}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="rhf-notes">
                        Notes (optional)
                    </label>

                    <textarea
                        id="rhf-notes"
                        {...register("notes")}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Placing order..."
                        : `Place Order — ${total} ETB`}
                </button>
            </form>
        </section>
    );
}

export default CheckoutHookForm;