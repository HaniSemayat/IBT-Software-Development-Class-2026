import Menu from "./Menu";
import OrderForm from "./OrderForm";
import CartBadge from "./CartBadge";
import Checkout from "./Checkout";
import CartProvider from "./cart/CartProvider";

function Header() {
    return (
        <header>
            <h1>Addis Eats</h1>
            <p>Delicious food from Addis Ababa</p>
            <CartBadge />
        </header>
    );
}

function App() {
    return (
        <CartProvider>
            <Header />

            <main>
                <h2>Addis Eats Menu</h2>

                <Menu />

                <Checkout />

                <OrderForm />
            </main>
        </CartProvider>
    );
}

export default App;