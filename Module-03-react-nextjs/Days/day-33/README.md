## Day 33 — Forms, Validation & React Hook Form

### Objective

Build an accessible Addis Eats checkout form using controlled React components, a single form state object, pure validation, submission states, and React Hook Form.

### What I Built

* Controlled checkout form using one `form` state object
* One change handler for all form fields
* Name, TeleBirr phone, delivery area, and optional notes
* Pure `validate(form)` function
* Touched-field validation
* Live error updates after a field has been touched
* Accessible labels and validation messages
* `aria-invalid` for invalid fields
* `aria-describedby` connecting fields to their error messages
* `role="alert"` for important error messages
* First invalid field receives focus after failed submission
* Submit button disabled while an order is being submitted
* ETB cart total displayed in the submit button
* Successful order handling
* Simulated server-side `422` validation failure
* Form values preserved when submission fails
* React Hook Form version of the checkout form
* Improved UI styling for the home page, menu, cart, and checkout form

### Validation Rules

| Field          | Rule                   | Why it exists                                       |
| -------------- | ---------------------- | --------------------------------------------------- |
| Name           | Required               | The restaurant needs to know who receives the order |
| Name           | Minimum 2 characters   | Prevents incomplete names                           |
| TeleBirr Phone | Required               | Provides the payment/contact number                 |
| TeleBirr Phone | Ethiopian phone format | Ensures the number follows the expected format      |
| Delivery Area  | Required               | The order needs a delivery destination              |
| Notes          | Optional               | Customers can provide extra instructions if needed  |

### Form State

All controlled fields are stored in one object:

```js
{
    name: "",
    phone: "",
    area: "Bole",
    notes: ""
}
```

A single `handleChange` function uses the input's `name` attribute to update the correct property.

### Validation

Validation is kept separate in:

`src/checkout/validate.js`

The `validate(form)` function is pure and returns an errors object without modifying React state.

Errors are derived during rendering:

```js
const errors = validate(form);
```

The `touched` state controls when validation errors become visible.

### Submission Handling

The form uses:

```jsx
<form onSubmit={handleSubmit}>
```

The submit handler:

1. Prevents the browser's default form submission
2. Marks the fields as touched
3. Validates the form
4. Focuses the first invalid field when necessary
5. Prevents duplicate submissions
6. Sets a submitting state while the order is being processed
7. Clears the cart only after a successful order

The submit button is disabled during submission and displays the cart total in ETB.

### Failure Handling

The local order API simulates a server-side `422` validation error for:

`0911111111`

When the server rejects the order:

* The user's form values are preserved
* A general submission error is displayed
* The specific server error is shown on the affected field
* The invalid field is marked as touched
* Focus moves to the first server-invalid field

The form is only cleared after a successful order.

### Accessibility

Each field has a real `<label>` connected to its input with `htmlFor`.

Invalid fields use:

```jsx
aria-invalid
```

Error messages are connected to their fields with:

```jsx
aria-describedby
```

Important error messages use:

```jsx
role="alert"
```

Validation does not rely only on color, and keyboard users can navigate and submit the form.

### React Hook Form

The project also includes:

`src/checkout/CheckoutHookForm.jsx`

This version demonstrates how React Hook Form can simplify form management using:

* `register`
* `handleSubmit`
* `formState.errors`
* `isSubmitting`

The manual controlled version remains the main checkout implementation because it demonstrates the underlying React form concepts before using a form library.

### Project Structure

```text
src/
├── api/
│   └── orders.js
│
├── auth/
│   ├── AuthContext.jsx
│   ├── RequireAuth.jsx
│   └── useAuth.js
│
├── cart/
│   ├── Cart.jsx
│   └── cartStore.jsx
│
├── checkout/
│   ├── Checkout.jsx
│   ├── CheckoutHookForm.jsx
│   ├── Field.jsx
│   └── validate.js
│
├── hooks/
│   └── useFetch.js
│
└── ...
```

### Day 33 Testing Checklist

* [x] Empty required fields show errors after submission
* [x] Untouched fields remain quiet until blurred
* [x] Corrected fields clear their errors immediately
* [x] Enter submits the form
* [x] Keyboard-only interaction works
* [x] Submit button disables during submission
* [x] ETB total appears in the submit button
* [x] Failed server submission preserves form values
* [x] Server-specific phone error is displayed
* [x] First invalid field receives focus
* [x] Error messages remain understandable without relying only on color
* [x] Successful order clears the cart
* [x] React Hook Form version implemented
* [x] Cart duplicate-item removal works correctly
* [x] Final cart item can be removed
* [x] Responsive styling works on smaller screens
* [x] Project builds successfully

```
```
