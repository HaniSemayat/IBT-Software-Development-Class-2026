class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


# Observer classes:

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
        # Stack to keep transaction history
        self.history = []


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

        # Save transaction in history
        self.history.append(("deposit", amount))
        self._notify(f"{self.owner} deposited {amount} ETB")

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be positive")

        if amount > self.__balance:
            raise ValueError("Insufficient balance")

        self.__balance -= amount

        # Save transaction in history
        self.history.append(("withdraw", amount))
        self._notify(f"{self.owner} withdrew {amount} ETB")

    def undo_last(self):

        # Nothing to undo
        if not self.history:
            print("No transaction to undo.")
            return

        transaction, amount = self.history.pop()

        if transaction == "deposit":
            self._Account__balance -= amount

        elif transaction == "withdraw":
            self._Account__balance += amount

        print(f"Undid {transaction} of {amount} ETB")


    def statement(self):

        print("Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print("=" * 30)


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
        print("=" * 30)


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

        # Save transaction in history
        self.history.append(("withdraw", amount))
        self._notify(f"{self.owner} withdrew {amount} ETB")

    
    def statement(self):
        print("Current Account")
        print(f"Owner: {self.owner}")
        print(f"Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
        print(f"Overdraft: {self.overdraft:.2f} ETB")
        print("=" * 30)


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

# Binary Search
def binary_search(items, target):

    left = 0
    right = len(items) - 1

    while left <= right:

        middle = (left + right) // 2

        if items[middle] == target:
            return middle

        elif items[middle] < target:
            left = middle + 1

        else:
            right = middle - 1

    return -1


# Store and find accounts quickly
class AccountRegistry:

    def __init__(self):

        # Fast lookup by account number
        self.by_number = {}

        # Keep insertion order
        self.order = []

    def add(self, account):

        self.by_number[account.account_number] = account
        self.order.append(account.account_number)

    def find(self, number):

        # O(1) lookup
        return self.by_number.get(number)

    def list_all(self):
        # Return all accounts in the order they were added
        return [self.by_number[number] for number in self.order]

    # Return accounts with the highest balances
    def top_by_balance(self, n=5):

        accounts = sorted(
            self.by_number.values(),
            key=lambda account: account.balance,
            reverse=True
        )

        return accounts[:n]


    # Find an account using binary search
    def find_by_number(self, number):

        numbers = sorted(self.by_number.keys())

        index = binary_search(numbers, number)

        if index == -1:
            return None

        return self.by_number[numbers[index]]


    # Recursive helper
    def _sum_transactions(self, history):

        if not history:
            return 0

        return history[0][1] + self._sum_transactions(history[1:])


    # Return the total transaction amount
    def total_transactions(self, number):

        account = self.find(number)

        if account:
            return self._sum_transactions(account.history)

        return 0

# Objects

sms = SMSAlert()
audit = AuditLog()
registry = AccountRegistry()

savings = AccountFactory.create("savings", "Hayat Seid", "1002", 3000)
current = AccountFactory.create("current", "Hamnael Dereje", "1003", 1500)

registry.add(savings)
registry.add(current)

savings.subscribe(sms)
savings.subscribe(audit)

current.subscribe(sms)
current.subscribe(audit)

# Transactions

savings.add_interest()
current.withdraw(2200)

print()

current.undo_last()

print()

# Singleton check

config1 = BankConfig()
config2 = BankConfig()

print("Singleton:", config1 is config2)

# Statements

print("Find account 1002")

account = registry.find("1002")

if account:
    account.statement()

print("All Accounts")

for account in registry.list_all():
    account.statement()

print("\nTop Balance")

for account in registry.top_by_balance(2):
    print(account.owner, "-", account.balance)

print("\nBinary Search")

account = registry.find_by_number("1002")

if account:
    print(account.owner)

print("\nTransaction Total")

print(registry.total_transactions("1002"))