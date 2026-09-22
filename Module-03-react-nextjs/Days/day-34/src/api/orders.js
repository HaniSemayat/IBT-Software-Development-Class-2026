export async function placeOrder(order) {
    await new Promise(function (resolve) {
        setTimeout(resolve, 1000);
    });

    if (order.phone === "0911111111") {
        const error = new Error(
            "Some order details need to be corrected."
        );

        error.status = 422;

        error.fieldErrors = {
            phone: "This phone number cannot be used."
        };

        throw error;
    }

    return {
        success: true,
        order: order
    };
}