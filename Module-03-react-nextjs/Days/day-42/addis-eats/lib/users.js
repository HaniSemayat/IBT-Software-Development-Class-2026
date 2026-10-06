const users = [
  {
    id: "user-1",
    name: "Addis",
    phone: "0911111111",
    password: "123456",
    role: "customer",
  },
  {
    id: "staff-1",
    name: "Kitchen Staff",
    phone: "0922222222",
    password: "123456",
    role: "staff",
  },
];

export async function getUserByPhone(phone) {
  return users.find((user) => user.phone === phone) ?? null;
}