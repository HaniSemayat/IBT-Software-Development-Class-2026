import Menu from "./Menu";
import OrderForm from "./OrderForm";
import dishes from "./data";

function Header() {
    return (
        <header>
            <h1>Addis Eats</h1>
            <p>Delicious food from Addis Ababa</p>
        </header>
    );
}

function App() {
    return (
        <>
            <Header />

            <main>
                <h2>Addis Eats Menu</h2>

                <Menu dishes={dishes} />

                <OrderForm />
            </main>
        </>
    );
}

export default App;