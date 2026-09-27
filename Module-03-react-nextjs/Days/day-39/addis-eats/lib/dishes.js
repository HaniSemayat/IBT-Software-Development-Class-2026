export const dishes = [
  { id: 1, name: "Doro Wot", price: 650 },
  { id: 2, name: "Tibs", price: 500 },
  { id: 3, name: "Veg Pizza", price: 450 },
  { id: 4, name: "Beef Burger", price: 380 },
  { id: 5, name: "Cheese Burger", price: 420 },
  { id: 6, name: "Coffee", price: 70 },
  { id: 7, name: "Macchiato", price: 80 },
  { id: 8, name: "Orange Juice", price: 120 },
  { id: 9, name: "Avocado Juice", price: 120 },
];

export async function getDishes() {
  return dishes;
}

export async function getDish(id) {
  return dishes.find((dish) => dish.id === Number(id));
}