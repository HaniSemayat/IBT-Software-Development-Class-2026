import {
    lazy,
    Suspense
} from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Layout from "./Layout";
import Home from "./Home";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import Cart from "./cart/Cart";
import Login from "./Login";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import AuthProvider from "./auth/AuthContext";
import ErrorBoundary from "./ErrorBoundary";

const Checkout = lazy(
    () => import("./checkout/Checkout")
);

const Receipt = lazy(
    () => import("./Receipt")
);

function Skeleton() {
    return (
        <section className="checkout">
            <p className="status">
                Loading page...
            </p>
        </section>
    );
}

function MenuUnavailable() {
    return (
        <>
            <h2>Menu unavailable</h2>

            <p>
                We could not load the menu right now.
                Please try again.
            </p>
        </>
    );
}

function CartUnavailable() {
    return (
        <>
            <h2>Cart unavailable</h2>

            <p>
                We could not load your cart right now.
                Please try again.
            </p>

            <p>
                <Link to="/menu">
                    Browse Menu
                </Link>
            </p>
        </>
    );
}

function CheckoutUnavailable() {
    return (
        <>
            <h2>Checkout unavailable</h2>

            <p>
                We could not load checkout.
                Please try again.
            </p>
        </>
    );
}

function ReceiptUnavailable() {
    return (
        <>
            <h2>Receipt unavailable</h2>

            <p>
                We could not load your receipt.
                Please try again.
            </p>

            <p>
                <Link to="/menu">
                    Back to Menu
                </Link>
            </p>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Layout />}
                    >
                        <Route
                            index
                            element={<Home />}
                        />

                        <Route
                            path="menu"
                            element={
                                <ErrorBoundary
                                    fallback={
                                        <MenuUnavailable />
                                    }
                                >
                                    <Menu />
                                </ErrorBoundary>
                            }
                        />

                        <Route
                            path="menu/:id"
                            element={
                                <ErrorBoundary
                                    fallback={
                                        <MenuUnavailable />
                                    }
                                >
                                    <DishDetail />
                                </ErrorBoundary>
                            }
                        />

                        <Route
                            path="cart"
                            element={
                                <ErrorBoundary
                                    fallback={
                                        <CartUnavailable />
                                    }
                                >
                                    <Cart />
                                </ErrorBoundary>
                            }
                        />

                        <Route
                            path="checkout"
                            element={
                                <ErrorBoundary
                                    fallback={
                                        <CheckoutUnavailable />
                                    }
                                >
                                    <Suspense
                                        fallback={
                                            <Skeleton />
                                        }
                                    >
                                        <RequireAuth>
                                            <Checkout />
                                        </RequireAuth>
                                    </Suspense>
                                </ErrorBoundary>
                            }
                        />

                        <Route
                            path="receipt"
                            element={
                                <ErrorBoundary
                                    fallback={
                                        <ReceiptUnavailable />
                                    }
                                >
                                    <Suspense
                                        fallback={
                                            <Skeleton />
                                        }
                                    >
                                        <Receipt />
                                    </Suspense>
                                </ErrorBoundary>
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