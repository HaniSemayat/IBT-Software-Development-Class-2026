# Exercise 1:
# Recursive sum and countdown

print("# Exercise 1:")

def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])


def count_down(n):
    if n == 0:
        return
    print(n)
    count_down(n - 1)


numbers = [10, 20, 30, 40]

print("Sum:", total(numbers))

count_down(5)


# Exercise 2:
# Binary Search

print("\n# Exercise 2:")

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


balances = [500, 1000, 1500, 2000, 2500]

print(binary_search(balances, 2000))
print(binary_search(balances, 900))


# Exercise 3:
# Merge Sort

print("\n# Exercise 3:")

def merge(left, right):

    result = []

    while left and right:

        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))

    return result + left + right


def merge_sort(items):

    if len(items) <= 1:
        return items

    middle = len(items) // 2

    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])

    return merge(left, right)


numbers = [8, 3, 5, 1, 9, 2]

print("Merge Sort:", merge_sort(numbers))
print("Python Sort:", sorted(numbers))


# Exercise 4:
# Sort with a key

print("\n# Exercise 4:")

accounts = [
    ("Abel", 2000),
    ("Hayat", 4500),
    ("Hamnael", 3000)
]

sorted_accounts = sorted(
    accounts,
    key=lambda account: account[1],
    reverse=True
)

for account in sorted_accounts:
    print(account)


# Exercise 5:
# Two Pointers

print("\n# Exercise 5:")

def has_pair(nums, target):

    left = 0
    right = len(nums) - 1

    while left < right:

        total = nums[left] + nums[right]

        if total == target:
            return True

        elif total < target:
            left += 1

        else:
            right -= 1

    return False


numbers = [2, 4, 6, 8, 10]

print(has_pair(numbers, 12))
print(has_pair(numbers, 15))