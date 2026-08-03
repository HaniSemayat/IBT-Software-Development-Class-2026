class Account:

    def __init__(self, owner, number, balance=0):

        self.owner = owner
        self.account_number = number
        self.__balance = balance


    @property
    def balance(self):
        return self.__balance


    def deposit(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        self.__balance += amount


    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.__balance:
            raise ValueError("Insufficient balance")

        self.__balance -= amount


    def statement(self):

        print("----------------------")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.balance} ETB")
        print("----------------------")



# Testing the class
dejen = Account("Dejen Bekele", "1001", 5000)
hayat = Account("Hayat Seid", "1002", 3000)
hamnael = Account("Hamnael Dereje","1003", 1500 )
# Transactions
dejen.deposit(1000)
hayat.withdraw(500)
hamnael.withdraw(770)

# Statements
dejen.statement()
hayat.statement()
hamnael.statement()
