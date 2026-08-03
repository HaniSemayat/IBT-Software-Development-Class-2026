from abc import ABC, abstractmethod

# Exercise 1 and 5: 
'''Vehicle hierarchy. Make a Vehicle base class with make, model, and a describe() method. 
Add Car and Truck subclasses. And Abstract method. Make Vehicle an abstract base class with an abstract wheels() method, and 
have each subclass return its own number.
'''

class Vehicle(ABC):

    def __init__(self, make, model):
        self.make = make
        self.model = model

    def describe(self):
        print(f"{self.make} {self.model}")

    @abstractmethod
    def wheels(self):
        pass



# Exercise 2: Car Class, Use super(). Give Truck a capacity attribute, setting make and model via super().__init__()

class Car(Vehicle):

    def wheels(self):
        return 4




# Exercise 3: Truck Class, Override. Override describe() in Truck so it also mentions the capacity.

class Truck(Vehicle):

    def __init__(self, make, model, capacity):

        super().__init__(make, model)

        self.capacity = capacity


    def describe(self):

        print(
            f"{self.make} {self.model} | Capacity: {self.capacity} tons"
        )


    def wheels(self):

        return 6



# objects:

car1 = Car("Toyota", "Corolla")

car2 = Car("Hyundai", "Elantra")

truck1 = Truck("Isuzu", "NPR", 8)

truck2 = Truck("Volvo", "FH16", 20)




# Exercise 4: Polymorphism. Put several vehicles in a list and loop over them, calling describe() on each.



vehicles = [

    car1,

    truck1,

    car2,

    truck2

]


print("Vehicle Report\n")

for vehicle in vehicles:

    vehicle.describe()

    print(f"Wheels: {vehicle.wheels()}")

    print("-" * 30)