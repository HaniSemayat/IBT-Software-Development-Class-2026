// Get elements from the page

const form = document.querySelector("#signup-form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const error = document.querySelector("#error");
const signupsList = document.querySelector("#signups");


// Ethiopian phone number pattern

const PHONE = /^(?:\+251|0)9\d{8}$/;


// Validate form values

function validate(name, phone) {

    if (name.trim().length < 2) {
        return "Enter your full name.";
    }

    if (!PHONE.test(phone)) {
        return "Enter a valid Ethiopian phone number.";
    }

    return "";
}


// Load saved signups from localStorage

function loadSignups() {

    try {

        const saved = localStorage.getItem("signups");

        if (!saved) {
            return [];
        }

        const signups = JSON.parse(saved);

        if (!Array.isArray(signups)) {
            return [];
        }

        return signups;

    } catch (err) {

        return [];
    }
}


// Save signups to localStorage

function saveSignups(signups) {

    localStorage.setItem(
        "signups",
        JSON.stringify(signups)
    );
}


// Render saved signups

function renderSignups(signups) {

    signupsList.innerHTML = "";

    signups.forEach(signup => {

        const li = document.createElement("li");

        li.textContent = `${signup.name} - ${signup.phone}`;

        signupsList.append(li);
    });
}


// Handle form submission

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    const message = validate(name, phone);

    error.textContent = message;

    if (message) {
        return;
    }


    // Create new signup

    const signup = {
        name: name,
        phone: phone
    };


    // Get existing signups

    const signups = loadSignups();


    // Add new signup

    signups.push(signup);


    // Save updated signups

    saveSignups(signups);


    // Update page

    renderSignups(signups);


    // Clear form

    form.reset();

    error.textContent = "";
});


// Restore saved signups when page loads

const savedSignups = loadSignups();

renderSignups(savedSignups);