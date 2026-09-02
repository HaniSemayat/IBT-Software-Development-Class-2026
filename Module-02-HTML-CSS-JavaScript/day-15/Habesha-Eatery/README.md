# Habesha Eatery

Habesha Eatery is a fictional Ethiopian restaurant website located in Bole, Addis Ababa.

This project was created as the Week 1 project for the CodeOps Full Stack Software Development program.

## Features

- Responsive mobile-first layout
- Sticky Flexbox navigation bar
- Responsive hero section
- Fluid heading using `clamp()`
- About/story section
- Responsive menu cards
- Reservation form with HTML validation
- Responsive footer
- Hover transitions
- Reduced-motion accessibility support

## Responsive Design

The menu uses CSS Grid.

### Mobile

1 column

### Tablet

2 columns at 768px

### Desktop

3 columns at 1024px

The menu uses:

`grid-template-columns: repeat(3, 1fr);`

at desktop size.

## CSS Techniques Used

### Flexbox

Flexbox is used for:

- Navigation
- Hero content
- Menu cards
- Form groups

### CSS Grid

Grid is used for:

- About section
- Menu section
- Footer

### CSS Variables

Colors, spacing and border radius are stored in `:root` variables.

### Sticky Positioning

The navigation header uses:

`position: sticky`

### Responsive Images

Images use:

`max-width: 100%;`

### Fluid Typography

The hero heading uses:

`clamp()`

to scale between different screen sizes.

### Accessibility

The project includes:

- Semantic HTML
- Form labels
- Required fields
- Image alt text
- Keyboard focus styles
- `prefers-reduced-motion`

## Technologies

- HTML5
- CSS3
- Flexbox
- CSS Grid
- Responsive Design

## Project Structure

```text
habesha-eatery/
│
├── index.html
├── styles.css
└── README.md