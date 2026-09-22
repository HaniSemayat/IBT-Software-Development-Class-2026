import {
    useCallback,
    useState
} from "react";

import DishItem from "./DishItem";
import Modal from "./ui/Modal";

function DishList({ dishes, onAdd }) {
    const [selectedDish, setSelectedDish] =
        useState(null);

    const handleQuickView =
        useCallback(function (dish) {
            setSelectedDish(dish);
        }, []);

    const handleClose =
        useCallback(function () {
            setSelectedDish(null);
        }, []);

    if (dishes.length === 0) {
        return (
            <p className="empty">
                No dishes in this category yet.
            </p>
        );
    }

    return (
        <>
            <section className="menu">
                {dishes.map(function (dish) {
                    return (
                        <DishItem
                            key={dish.id}
                            dish={dish}
                            onAdd={onAdd}
                            onQuickView={
                                handleQuickView
                            }
                        />
                    );
                })}
            </section>

            {selectedDish && (
                <Modal
                    title={selectedDish.name}
                    onClose={handleClose}
                >
                    <p>
                        Price:{" "}
                        {selectedDish.price} ETB
                    </p>

                    {selectedDish.spicy && (
                        <p>• Spicy</p>
                    )}

                    <p>
                        Enjoy this dish from
                        Addis Eats.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            onAdd(selectedDish);
                            handleClose();
                        }}
                    >
                        Add to Cart
                    </button>
                </Modal>
            )}
        </>
    );
}

export default DishList;