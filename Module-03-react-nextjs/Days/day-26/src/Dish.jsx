function Dish({ name, price }) {
    return (
        <article className="dish">
            <h2>{name}</h2>
            <p>{price} ETB</p>
        </article>
    );
}

export default Dish;