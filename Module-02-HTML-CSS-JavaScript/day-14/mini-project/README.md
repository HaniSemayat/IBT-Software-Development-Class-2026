# Ethio Telecom Dashboard

Ethio Telecom is an Ethiopian telecom-style customer dashboard I created as a Day 14 CSS layout mini-project.

## CSS Techniques Used

### CSS Grid

Grid is used for the main page skeleton:

- Header
- Sidebar
- Main content
- Footer

The layout uses `grid-template-areas` to organize these sections.

Grid is also used for the responsive statistics card grid with:

`repeat(auto-fit, minmax(220px, 1fr))`

### Flexbox

Flexbox is used for:

- Header navigation
- Navigation links
- Quick action buttons
- Card content

### Sticky Element

The header uses:

`position: sticky`

so it stays visible when the page is scrolled.

### Absolute Positioning

The Popular badge uses absolute positioning.

The card has:

`position: relative`

so the badge is positioned relative to the card.

### Responsive Design

A media query at 700px changes the desktop Grid layout into a single-column mobile layout.