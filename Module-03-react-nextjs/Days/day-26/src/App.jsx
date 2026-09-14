import Dish from "./Dish";

function Header() {
    return (
        <header>
            <h1>Addis Eats</h1>
            <p>Delicious food from Addis Ababa</p>
        </header>
    );
}

function App() {

    const dishes = [
        {
            id: 1,
            name: "Doro Wet",
            price: 650
        },
        {
            id: 2,
            name: "Tibs",
            price: 500
        },
        {
            id: 3,
            name: "Vegetable Pizza",
            price: 450
        },
        {
            id: 4,
            name: "Beef Burger",
            price: 380
        },
        {
            id: 5,
            name: "Cheese Burger",
            price: 420
        },
        {
            id: 6,
            name: "Coffee",
            price: 70
        },
        {
            id: 7,
            name: "Macchiato",
            price: 80
        },
        {
            id: 8,
            name: "Fresh Orange Juice",
            price: 120
        },
        {
            id: 9,
            name: "Fresh Avocado Juice",
            price: 120
        }
    ];

    return (
        <>
            <Header />

            <main>
                <h2>Menu</h2>

                <section className="menu">
                    {dishes.map(function (dish) {
                        return (
                            <Dish
                                key={dish.id}
                                name={dish.name}
                                price={dish.price}
                            />
                        );
                    })}
                </section>
            </main>
        </>
    );
}

export default App;