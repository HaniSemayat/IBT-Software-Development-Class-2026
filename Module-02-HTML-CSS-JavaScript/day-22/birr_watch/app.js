const statusElement = document.querySelector("#status");
const form = document.querySelector("#convert-form");
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const result = document.querySelector("#result");
const watchlist = document.querySelector("#watchlist");
const addWatchlist = document.querySelector("#add-watchlist");

const API = "https://open.er-api.com/v6/latest/ETB";

const state = {
    base: "ETB",
    rates: {},
    watchlist: [],
    amount: 100,
    currency: "USD"
};


function render() {

    // Currency dropdown
    currency.innerHTML = Object.keys(state.rates)
        .filter(code=> code !== state.rates)
        .map(code => `<option value="${code}">${code}</option>`)
        .join("");

    currency.value = state.currency;

    // Conversion result
    const rate = state.rates[state.currency];

    if (rate) {

        const converted = state.amount * rate;

        result.textContent =
            `${state.amount} ETB = ${converted.toFixed(2)} ${state.currency}`;

    }


    // Watchlist
    if (state.watchlist.length === 0) {

        watchlist.innerHTML = "<li>No currencies yet</li>";

    } else {

        watchlist.innerHTML = state.watchlist.map(code => `
            <li>
                <span>${code}</span>
                <button data-remove="${code}">Remove</button>
            </li>
        `).join("");

    }

}


async function loadRates() {

    statusElement.textContent = "Loading rates…";

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        state.rates = data.rates;

        statusElement.textContent = "";


    } catch (error) {

        statusElement.textContent = "Could not load rates.";

    }

}


function save() {

    localStorage.setItem(
        "birrwatch",
        JSON.stringify({
            watchlist: state.watchlist,
            currency: state.currency
        })
    );

}


function load() {

    const saved = localStorage.getItem("birrwatch");

    if (!saved) {
        return;
    }

    try {

        Object.assign(state, JSON.parse(saved));

    } catch (error) {

        console.log("Could not load saved data.");

    }

}


form.addEventListener("submit", (event) => {

    event.preventDefault();

    const value = Number(amount.value);

    if (!value || value <= 0) {

        result.textContent = "Please enter a valid amount.";

        return;
    }

    state.amount = value;
    state.currency = currency.value;

    render();

});


addWatchlist.addEventListener("click", () => {

    const code = currency.value;

    if (!state.watchlist.includes(code)) {

        state.watchlist.push(code);

        save();

    }

    render();

});


watchlist.addEventListener("click", (event) => {

    const codeToRemove = event.target.dataset.remove;

    if (!codeToRemove) {
        return;
    }

    state.watchlist = state.watchlist.filter(
        code => code !== codeToRemove
    );

    save();

    render();

});


async function init() {

    load();

    await loadRates();

    render();

}

init();