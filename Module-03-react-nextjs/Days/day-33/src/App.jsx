import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Home from "./Home";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import Cart from "./cart/Cart";
import Checkout from "./checkout/Checkout";
import Login from "./Login";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import AuthProvider from "./auth/AuthContext";

function App() {
    return (
        <AuthProvider>
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
                                path="/checkout"
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
        </AuthProvider>
    );
}

export default App;