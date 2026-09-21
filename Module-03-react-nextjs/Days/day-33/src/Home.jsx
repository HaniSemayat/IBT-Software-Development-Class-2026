import { Link } from "react-router-dom";

function Home() {
    return (
        <section>
            <h2>Welcome to Addis Eats</h2>

            <p>
                Enjoy delicious Ethiopian food and other favorites
                from Addis Ababa.
            </p>

            <h3>Today's Specials</h3>

            <p>
                Doro Wot, Tibs, and Fresh Avocado Juice.
            </p>

            <Link to="/menu">
                View Full Menu
            </Link>
        </section>
    );
}

export default Home;