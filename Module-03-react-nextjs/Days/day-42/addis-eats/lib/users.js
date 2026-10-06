const users = [
  {
    id: "user-1",
    name: "Addis Tesfa",
    email: "addistesfa@gmail.com",
    password: "123456",
    role: "customer",
  },
  {
    id: "staff-1",
    name: "Admin One",
    email: "adminone@addiseats.com",
    password: "123456",
    role: "staff",
  },
];

export async function getUserByEmail(email) {
  return (
    users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    ) ?? null
  );
}
