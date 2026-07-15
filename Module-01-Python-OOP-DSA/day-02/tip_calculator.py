#Store a bill total (ETB) and number of people in variables.

total = 2000
people = 4

friends = [
            "Khalid",
            "Tolosa", 
            "Kaleab", 
            "Hagos"
]

#Write a function split_bill(total, people, tip_rate=0.10).

def split_bill(total, people, tip_rate = 0.10):

    # Use it to compute the per-person amount, tip included.
    tip = total * tip_rate
    per_person_amount = (total + tip) / people

    # Loop over a list of names and print each person's share.
    for name in friends:
        print(f"{name}, your share is {per_person_amount:.2f} ETB")

#Call the fuction
split_bill(total, people, tip_rate = 0.10)

