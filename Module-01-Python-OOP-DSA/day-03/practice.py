
# Exercise 1: Unique Cities


cities = [
    "Addis Ababa",
    "Adama",
    "Hawassa",
    "Adama",
    "Addis Ababa",
    "Bahir Dar",
    "Mekele"
]

# A set keeps only unique values
unique_cities = set(cities)

print("Unique Cities:")
print(unique_cities)

print("Count:", len(unique_cities))



# Exercise 2: Price Report


# Dictionary of grocery items and prices
prices = {
    "Bread": 15,
    "Milk": 150,
    "Rice": 120,
    "Sugar": 180,
    "Oil": 2000
}

print("\nPrice Report")

# .items() gives both key and value
for item, price in prices.items():
    print(item, "-", price, "ETB")



# Exercise 3: Tax Comprehension

prices = [100, 250, 400, 80]

# Add 15% tax to every price
tax_prices = [price * 1.15 for price in prices]

print("\nPrices with Tax")
print(tax_prices)



# Exercise 4: Cheap Items


# Keep only prices below 200
cheap_prices = [price for price in prices if price < 200]

print("\nCheap Prices")
print(cheap_prices)



# Exercise 5: Write & Read File


# Write names into a file
with open("names.txt", "w") as file:
    file.write("Hayat\n")
    file.write("Hamnael\n")
    file.write("Abel\n")
    file.write("Hagos\n")

print("\nNames from File")

# Read the file
with open("names.txt", "r") as file:
    for name in file:
        print(name.strip())



# Exercise 6: Safe Division


try:
    number = int(input("\nEnter a number: "))

    result = 1000 / number

    print("Result:", result)

except ValueError:
    print("Please enter a valid number.")

except ZeroDivisionError:
    print("You cannot divide by zero.")