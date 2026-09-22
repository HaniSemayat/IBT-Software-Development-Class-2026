import { NavLink, Outlet } from "react-router-dom";
import CartBadge from "./CartBadge";

function Layout() {
    return (
        <>
            <header>
                <h1>Addis Eats</h1>

                <p>Delicious food from Addis Ababa</p>

                <nav>
                    <NavLink to="/">
                        Home
                    </NavLink>

                    <NavLink to="/menu">
                        Menu
                    </NavLink>

                    <NavLink to="/cart">
                        Cart
                    </NavLink>

                    <NavLink to="/checkout">
                        Checkout
                    </NavLink>
                </nav>

                <CartBadge />
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>Addis Eats</p>
            </footer>
        </>
    );
}

export default Layout;