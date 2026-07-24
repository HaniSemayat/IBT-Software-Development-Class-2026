# Exercise 1:
# Build a Binary Search Tree (BST)
# Smaller values go left, bigger values go right.
# In-order traversal visits: Left -> Root -> Right
# so the output becomes sorted.

print("# Exercise 1:")


class Node:

    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):

    # If tree is empty, create first node
    if root is None:
        return Node(value)

    # Smaller values go to left side
    if value < root.value:
        root.left = insert(root.left, value)

    # Bigger values go to right side
    else:
        root.right = insert(root.right, value)

    return root


def inorder(root):

    if root:
        inorder(root.left)
        print(root.value)
        inorder(root.right)


root = None

balances = [5000, 2000, 8000, 1000, 3000]

for balance in balances:
    root = insert(root, balance)


inorder(root)



# Exercise 2:
# Tree depth means the longest path from root to a leaf.
# We use recursion:
# height = 1 + maximum(left height, right height)

print("\n# Exercise 2:")


def height(node):

    if node is None:
        return 0

    return 1 + max(height(node.left), height(node.right))


print(height(root))



# Exercise 3:
# BFS (Breadth First Search)
# Visits neighbors level by level.
# Uses a queue.

print("\n# Exercise 3:")


graph = {

    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": [],
    "F": []

}


def bfs(graph, start):

    visited = set()
    queue = [start]

    while queue:

        vertex = queue.pop(0)

        if vertex not in visited:

            visited.add(vertex)

            queue.extend(graph[vertex])

    return visited


print(bfs(graph, "A"))



# Exercise 4:
# DFS (Depth First Search)
# Goes deep first before returning.
# Uses recursion.

print("\n# Exercise 4:")


def dfs(graph, start, visited=None):

    if visited is None:
        visited = []

    visited.append(start)

    for neighbor in graph[start]:

        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited


print(dfs(graph, "A"))



# Exercise 5:
# Priority Queue
# heapq always removes the smallest priority first.
# (1, task) has higher priority than (5, task)

print("\n# Exercise 5:")


import heapq


tasks = [

    (3, "Study"),
    (1, "Fix Bug"),
    (5, "Watch Movie"),
    (2, "Exercise"),
    (4, "Read")

]


heap = []


for task in tasks:
    heapq.heappush(heap, task)


while heap:

    priority, task = heapq.heappop(heap)

    print(priority, task)