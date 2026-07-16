# =====================================
# Exercise 1: Book Class
# =====================================

class Book:
    def __init__(self, title, author, pages):

        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):

        print(
            f"{self.title} by {self.author}, {self.pages} pages"
        )

book1 = Book("Python Basics", "Debebe Megersa", 300)
book2 = Book("Clean Code", "Jemal Hussein", 450)

print("BOOKS:")
book1.describe()
book2.describe()



# Exercises 2, 3, 4, 5: Product Class


class Product:

    def __init__(self, name, price, quantity):

        self.name = name
        self.price = price
        self.__quantity = quantity


    # Exercise 3: Getter for private quantity

    @property
    def quantity(self):
        return self.__quantity



    # Exercise 2:Increase stock

    def restock(self, amount):

        if amount <= 0:
            raise ValueError("Restock amount must be positive")

        self.__quantity += amount



    # Exercise 2 + 4: Sell product safely

    def sell(self, amount):

        if amount <= 0:
            raise ValueError("Sell amount must be positive")

        if amount > self.__quantity:
            raise ValueError(
                "Not enough quantity available"
            )

        self.__quantity -= amount



# Exercise 5: Independence Test


phone = Product("Itel", 30000, 10)
laptop = Product("Ethio Laptop", 60000, 5)
tablet = Product("Tablet", 20000, 8)

print("\nPRODUCTS BEFORE SELL:")
print(phone.name, phone.quantity)
print(laptop.name, laptop.quantity)
print(tablet.name, tablet.quantity)

# Change only phone
phone.sell(3)
phone.restock(5)

print("\nPRODUCTS AFTER PHONE UPDATE:")
print(phone.name, phone.quantity)
print(laptop.name, laptop.quantity)
print(tablet.name, tablet.quantity)