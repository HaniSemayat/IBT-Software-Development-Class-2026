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

        print("Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print("-" * 30)


class SavingsAccount(Account):

    def __init__(self, owner, number, balance=0, rate=0.05):

        super().__init__(owner, number, balance)

        self.rate = rate

    def add_interest(self):

        interest = self.balance * self.rate

        self.deposit(interest)

    def statement(self):

        print("Savings Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print(f"Rate: {self.rate * 100}%")
        print("-" * 30)


class CurrentAccount(Account):

    def __init__(self, owner, number, balance=0, overdraft=1000):

        super().__init__(owner, number, balance)

        self.overdraft = overdraft

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded")

        self._Account__balance -= amount

    def statement(self):

        print("Current Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print(f"Overdraft: {self.overdraft:.2f} ETB")
        print("-" * 30)


# Objects

account = Account("Dejen Bekele", "1001", 5000)

savings = SavingsAccount("Hayat Seid", "1002", 3000)

current = CurrentAccount("Hamnael Dereje", "1003", 1500)


# Transactions

account.deposit(500)

savings.add_interest()

current.withdraw(2200)


# Polymorphism

accounts = [

    account,

    savings,

    current

]

for acc in accounts:

    acc.statement()