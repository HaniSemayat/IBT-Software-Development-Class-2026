function validate(form) {
    const errors = {};

    if (!form.name.trim()) {
        errors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
    }

    if (!form.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (
        !/^(?:\+251|0)9\d{8}$/.test(form.phone.trim())
    ) {
        errors.phone =
            "Enter a valid Ethiopian phone number.";
    }

    if (!form.area.trim()) {
        errors.area = "Delivery area is required.";
    }

    return errors;
}

export default validate;