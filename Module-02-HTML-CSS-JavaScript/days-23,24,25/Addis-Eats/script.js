const state = {
    dishes: [],
    cart: [],
    search: "",
    category: "All"
};


const menuContainer = document.querySelector("#menu-container");
const cartContainer = document.querySelector("#cart-container");
const cartTotal = document.querySelector("#cart-total");

const searchInput = document.querySelector("#search");

const loading = document.querySelector("#loading");
const error = document.querySelector("#error");
const emptyMenu = document.querySelector("#empty-menu");

const categoryButtons = document.querySelectorAll(".category-btn");

const checkoutButton = document.querySelector("#checkout-button");
const checkoutSection = document.querySelector("#checkout-section");
const checkoutForm = document.querySelector("#checkout-form");
const formError = document.querySelector("#form-error");

const retryButton = document.querySelector("#retry-button");

const confirmation = document.querySelector("#confirmation");
const confirmationMessage = document.querySelector("#confirmation-message");


function load() {

    const savedCart = localStorage.getItem("addiseats");

    if (savedCart) {
        state.cart = JSON.parse(savedCart);
    }

}


function save() {

    localStorage.setItem(
        "addiseats",
        JSON.stringify(state.cart)
    );

}


async function loadMenu() {

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    retryButton.classList.add("hidden");

    try {

        const response = await fetch("data/menu.json");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        state.dishes = await response.json();

        loading.classList.add("hidden");

        render();

    } catch (err) {

        loading.classList.add("hidden");
        error.classList.remove("hidden");
        retryButton.classList.remove("hidden");

        console.error(err);

    }

}


retryButton.addEventListener("click", function () {
    loadMenu();
});

function renderMenu() {

    const filteredDishes = state.dishes.filter(function (dish) {

        const matchesSearch =
            dish.name.toLowerCase().includes(
                state.search.toLowerCase()
            );

        const matchesCategory =
            state.category === "All" ||
            dish.category === state.category;

        return matchesSearch && matchesCategory;

    });


    if (filteredDishes.length === 0) {

        menuContainer.innerHTML = "";
        emptyMenu.classList.remove("hidden");

        return;

    }


    emptyMenu.classList.add("hidden");


    menuContainer.innerHTML = filteredDishes.map(function (dish) {

        return `
            <article class="dish" data-id="${dish.id}">

                <img
                    src="${dish.image}"
                    alt="${dish.name}"
                >

                <h3>${dish.name}</h3>

                <p>${dish.description}</p>

                <p class="price">
                    ${dish.price} ETB
                </p>

                <button class="add">
                    Add to Cart
                </button>

            </article>
        `;

    }).join("");

}


function renderCart() {

    if (state.cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        cartTotal.textContent = "0 ETB";

        return;

    }


    cartContainer.innerHTML = state.cart.map(function (item) {

        return `
            <div class="cart-item" data-id="${item.id}">

                <div class="cart-item-info">

                    <strong>${item.name}</strong>

                    <span>
                        ${item.price} ETB × ${item.qty}
                    </span>

                    <div class="quantity-controls">

                        <button class="minus">
                            −
                        </button>

                        <span>
                            ${item.qty}
                        </span>

                        <button class="plus">
                            +
                        </button>

                    </div>

                </div>

                <button class="rm">
                    Remove
                </button>

            </div>
        `;

    }).join("");


    const total = state.cart.reduce(function (sum, item) {

        return sum + item.price * item.qty;

    }, 0);


    cartTotal.textContent = `${total} ETB`;

}


function render() {

    renderMenu();
    renderCart();

}


searchInput.addEventListener("input", function () {

    state.search = searchInput.value;

    renderMenu();

});


categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        state.category = button.dataset.category;


        categoryButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        renderMenu();

    });

});


menuContainer.addEventListener("click", function (event) {

    if (!event.target.classList.contains("add")) {
        return;
    }


    const dishElement = event.target.closest(".dish");

    const id = Number(dishElement.dataset.id);


    const dish = state.dishes.find(function (item) {
        return item.id === id;
    });


    const existingItem = state.cart.find(function (item) {
        return item.id === id;
    });


    if (existingItem) {

        existingItem.qty += 1;

    } else {

        state.cart.push({
            ...dish,
            qty: 1
        });

    }


    save();
    renderCart();

});


cartContainer.addEventListener("click", function (event) {

    const cartItem = event.target.closest(".cart-item");

    if (!cartItem) {
        return;
    }


    const id = Number(cartItem.dataset.id);


    const item = state.cart.find(function (cartItem) {
        return cartItem.id === id;
    });


    if (event.target.classList.contains("plus")) {

        item.qty += 1;

    }


    if (event.target.classList.contains("minus")) {

        item.qty -= 1;


        if (item.qty <= 0) {

            state.cart = state.cart.filter(function (cartItem) {
                return cartItem.id !== id;
            });

        }

    }


    if (event.target.classList.contains("rm")) {

        state.cart = state.cart.filter(function (cartItem) {
            return cartItem.id !== id;
        });

    }


    save();
    renderCart();

});


checkoutButton.addEventListener("click", function () {

    if (state.cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    checkoutSection.classList.remove("hidden");


    checkoutSection.scrollIntoView({
        behavior: "smooth"
    });

});


checkoutForm.addEventListener("submit", function (event) {

    event.preventDefault();

    formError.textContent = "";


    const name = document.querySelector("#name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const area = document.querySelector("#area").value;
    const address = document.querySelector("#address").value.trim();


    if (!name || !phone || !area || !address) {

        formError.textContent =
            "Please fill in all fields.";

        return;
    }


    const phonePattern = /^(?:\+251|0)9\d{8}$/;


    if (!phonePattern.test(phone)) {

        formError.textContent =
            "Please enter a valid Ethiopian phone number.";

        return;
    }


    placeOrder(name, phone, area, address);

});


function placeOrder(name, phone, area, address) {

    const total = state.cart.reduce(function (sum, item) {

        return sum + item.price * item.qty;

    }, 0);


    const order = {

        customer: {
            name: name,
            phone: phone,
            area: area,
            address: address
        },

        cart: state.cart,

        total: total,

        timestamp: new Date().toISOString()

    };


    console.log("Order:", order);


    state.cart = [];

    save();

    render();


    checkoutSection.classList.add("hidden");

    confirmation.classList.remove("hidden");


    confirmationMessage.textContent =
        `Order placed — ${total} ETB, delivering to ${area}.`;


    checkoutForm.reset();


    confirmation.scrollIntoView({
        behavior: "smooth"
    });

}


async function init() {

    load();

    renderCart();

    await loadMenu();

}


init();