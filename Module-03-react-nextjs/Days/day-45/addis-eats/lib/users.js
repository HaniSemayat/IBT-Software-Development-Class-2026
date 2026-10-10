
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
  if (typeof email !== "string") return null;

  return (
    users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    ) ?? null
  );
}

export async function createUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (await getUserByEmail(normalizedEmail)) {
    return { error: "An account with this email already exists." };
  }

  const user = {
    id: `user-${crypto.randomUUID()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "customer",
  };

  users.push(user);

  return { user };
}
