import { BrowserRouter, Routes, Route } from "react-router-dom";

import CartProvider from "./cart/CartProvider";
import Layout from "./Layout";
import Home from "./Home";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Login from "./Login";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import AuthProvider from "./auth/AuthContext";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />

                            <Route path="menu" element={<Menu />} />

                            <Route
                                path="menu/:id"
                                element={<DishDetail />}
                            />

                            <Route
                                path="cart"
                                element={<Cart />}
                            />

                            <Route
                                path="checkout"
                                element={
                                    <RequireAuth>
                                        <Checkout />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="login"
                                element={<Login />}
                            />

                            <Route
                                path="*"
                                element={<NotFound />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;