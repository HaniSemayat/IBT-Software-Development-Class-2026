import time
from collections import deque

# Exercise 1:
# Big-O Examples

print("# Exercise 1:")

# List index -> O(1): Direct access by index.
# Single loop -> O(n): Visits every element once.
# Nested loop -> O(n²): Every element loops through every element.
# Dict lookup -> O(1): Hash table lookup.
# Binary search -> O(log n): Cuts search space in half each step.

print("Big-O comments added.")


# Exercise 2:
# List vs Dict Lookup

print("\n# Exercise 2:")

accounts_list = [f"ACC{i}" for i in range(100000)]
accounts_dict = {f"ACC{i}": i for i in range(100000)}

target = "ACC99999"

start = time.perf_counter()
target in accounts_list
end = time.perf_counter()
print("List lookup:", end - start)

start = time.perf_counter()
target in accounts_dict
end = time.perf_counter()
print("Dict lookup:", end - start)


# Exercise 3:
# Stack

print("\n# Exercise 3:")

class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]


names = ["Belay", "Selamawit", "Paul"]

stack = Stack()

for name in names:
    stack.push(name)

reversed_names = []

while stack.items:
    reversed_names.append(stack.pop())

print(reversed_names)


# Exercise 4:
# Queue

print("\n# Exercise 4:")

queue = deque()

customers = ["Kdusan", "Daniel", "Efrata", "Elias", "Abdi"]

for customer in customers:
    queue.append(customer)

while queue:
    print("Serving:", queue.popleft())


# Exercise 5:
# Singly Linked List

print("\n# Exercise 5:")

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def print_all(self):
        current = self.head
        while current:
            print(current.data)
            current = current.next


ll = LinkedList()

ll.push_front("Papaye")
ll.push_front("Banana")
ll.push_front("Mango")

ll.print_all()