import Menu from "./Menu";
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
                <h2>Ethiopian Menu</h2>

                <Menu
                    dishes={dishes}
                    category="Ethiopian"
                />
            </main>
        </>
    );
}

export default App;