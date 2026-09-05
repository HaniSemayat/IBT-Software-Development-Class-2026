// Get elements from the page

const form = document.querySelector("#search-form");
const countryInput = document.querySelector("#country");
const out = document.querySelector("#facts");


// Render one fact

function render(label, value) {

    const p = document.createElement("p");

    p.classList.add("fact");

    p.textContent = `${label}: ${value}`;

    out.append(p);
}


// Fetch and display country information

async function showCountry(name) {

    out.textContent = "Loading...";

    try {

        const res = await fetch(
            `https://countries.dev/name/${encodeURIComponent(name)}`
        );

        if (!res.ok) {
            throw new Error("Country not found");
        }

        const [country] = await res.json();

        out.innerHTML = "";


        // Flag

        const flag = document.createElement("img");

        flag.src = country.flags.svg;
        flag.alt = `${country.name} flag`;

        out.append(flag);


        // Country name

        const title = document.createElement("h3");

        title.textContent = country.name;

        out.append(title);


        // Country facts

        render(
            "Capital",
            country.capital || "N/A"
        );

        render(
            "Population",
            country.population.toLocaleString()
        );

        render(
            "Region",
            country.region || "N/A"
        );


        // Currencies

        const currencyNames = (country.currencies || [])
            .map(currency => currency.name)
            .join(", ");

        render(
            "Currencies",
            currencyNames || "N/A"
        );

    } catch (err) {

        out.textContent = err.message;
    }
}


// Handle search

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = countryInput.value.trim();

    if (!name) {
        return;
    }

    showCountry(name);
});


// Show Ethiopia when the page loads

showCountry("ethiopia");