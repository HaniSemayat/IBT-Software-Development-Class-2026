class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


# Observer :

class SMSAlert:
    def update(self, message):
        print("SMS:", message)


class AuditLog:
    def update(self, message):
        print("Audit:", message)


# Account

class Account:

    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.account_number = number
        self.__balance = balance
        self.observers = []

    @property
    def balance(self):
        return self.__balance

    def subscribe(self, observer):
        self.observers.append(observer)

    def _notify(self, message):
        for observer in self.observers:
            observer.update(message)

    def deposit(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        self.__balance += amount
        self._notify(f"{self.owner} deposited {amount} ETB")

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.__balance:
            raise ValueError("Insufficient balance")

        self.__balance -= amount
        self._notify(f"{self.owner} withdrew {amount} ETB")

    def statement(self):

        print("Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print("-" * 30)


#  Savings

class SavingsAccount(Account):

    def __init__(self, owner, number, balance=0):
        super().__init__(owner, number, balance)
        self.rate = BankConfig().interest_rate

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


# Current 

class CurrentAccount(Account):

    def __init__(self, owner, number, balance=0):
        super().__init__(owner, number, balance)
        self.overdraft = BankConfig().overdraft_limit

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded")

        self._Account__balance -= amount
        self._notify(f"{self.owner} withdrew {amount} ETB")

    def statement(self):
        print("Current Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print(f"Overdraft: {self.overdraft:.2f} ETB")
        print("-" * 30)


# Factory 

class AccountFactory:

    @staticmethod
    def create(kind, owner, number, balance=0):

        if kind == "savings":
            return SavingsAccount(owner, number, balance)

        elif kind == "current":
            return CurrentAccount(owner, number, balance)

        else:
            raise ValueError("Invalid account type")


# Objects

sms = SMSAlert()
audit = AuditLog()

savings = AccountFactory.create("savings", "Hayat Seid", "1002", 3000)
current = AccountFactory.create("current", "Hamnael Dereje", "1003", 1500)

savings.subscribe(sms)
savings.subscribe(audit)

current.subscribe(sms)
current.subscribe(audit)

# Transactions

savings.add_interest()
current.withdraw(2200)

# Singleton check

config1 = BankConfig()
config2 = BankConfig()

print("Singleton:", config1 is config2)

# Statements

accounts = [savings, current]

for acc in accounts:
    acc.statement()