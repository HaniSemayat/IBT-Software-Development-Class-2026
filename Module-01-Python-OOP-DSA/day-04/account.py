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
            print("Deposit amount must be positive.")
            return

        self.__balance += amount
        print(f"{amount} ETB deposited successfully.")


    def withdraw(self, amount):

        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return

        if amount > self.__balance:
            print("Insufficient balance.")
            return

        self.__balance -= amount
        print(f"{amount} ETB withdrawn successfully.")


    def statement(self):

        print("--------------------")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.balance} ETB")
        print("--------------------")


# Creating two accounts
almaz = Account("Almaz Bekele", "1001", 5000)
dawit = Account("Dawit Tesfaye", "1002", 3000)

# Transactions
almaz.deposit(1000)
dawit.withdraw(500)

# Statements
almaz.statement()
dawit.statement()

# Testing property
print(almaz.balance)
