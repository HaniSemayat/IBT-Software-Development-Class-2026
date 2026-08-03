INPUT_FILE = "transactions.txt"
OUTPUT_FILE = "report.txt"

#Read transactions.txt line by line (name,amount per line)
def read_transactions(filename):

    # Build a dict mapping each customer to their total spend.
    totals = {}
    # Print each customer and total, sorted highest first. And, wrap the file read in try / except for a missing file.
    try:

        with open(filename) as file:

            for line in file:

                name, amount = line.strip().split(",")

                amount = float(amount)

                totals[name] = totals.get(name, 0) + amount

    except FileNotFoundError:

        print("File not found.")

        return {}

    return totals


def print_summary(totals):

    sorted_totals = sorted(
        totals.items(),
        key=lambda item: item[1],
        reverse=True
    )

    print("Transaction Summary")

    for name, amount in sorted_totals:

        print(f"{name}: {amount:.2f}")


def write_report(totals, filename):

    sorted_totals = sorted(
        totals.items(),
        key=lambda item: item[1],
        reverse=True
    )

    with open(filename, "w") as file:

        for name, amount in sorted_totals:

            file.write(f"{name}: {amount:.2f}\n")


def main():

    totals = read_transactions(INPUT_FILE)

    print_summary(totals)

    write_report(totals, OUTPUT_FILE)


if __name__ == "__main__":
    main()