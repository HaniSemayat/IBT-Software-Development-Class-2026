// Get the elements from the page

const form = document.querySelector("#add-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");


// Add an item to the list

function addRow(itemName, itemPrice) {

    const li = document.createElement("li");

    li.dataset.price = itemPrice;

    const text = document.createElement("span");
    text.textContent = `${itemName} - ${itemPrice} ETB`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("del");

    li.append(text, deleteButton);

    list.append(li);
}


// Update the running total

function updateTotal() {

    let total = 0;

    const items = list.querySelectorAll("li");

    items.forEach(li => {

        const priceText = li.dataset.price;

        total += Number(priceText);

    });

    totalEl.textContent = total;
}


// Handle form submission

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const itemName = name.value.trim();
    const itemPrice = Number(price.value);

    if (!itemName || !itemPrice) {
        return;
    }

    addRow(itemName, itemPrice);

    form.reset();

    updateTotal();
});


// Handle list clicks using event delegation

list.addEventListener("click", (e) => {

    if (e.target.matches(".del")) {

        const li = e.target.closest("li");

        li.remove();

        updateTotal();

    } else {

        const li = e.target.closest("li");

        if (li) {
            li.classList.toggle("bought");
        }

    }

});