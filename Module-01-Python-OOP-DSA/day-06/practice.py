# Exercise 1:
'''Spot the SRP violation. Take a Report class that builds, saves, and emails a report. Split it 
into three focused classes.'''

print("# Exercise 1: ")

class Report:
    def build(self):
        return "Report content"


class ReportSaver:
    def save(self, report):
        print("Report saved")


class ReportEmailer:
    def email(self, report):
        print("Report emailed")

report = Report()
content = report.build()
print(content)

saver = ReportSaver()
saver.save(content)

emailer = ReportEmailer()
emailer.email(content)


# Exercise 2:
'''Refactor to OCP. Replace an if/elif that prints a shape's area by shape type with a small 
class hierarchy and one method.'''

print("\n# Exercise 2:")

class Shape:
    def area(self):
        pass


class Circle(Shape):
    def area(self):
        return "Circle area"


class Square(Shape):
    def area(self):
        return "Square area"


class Triangle(Shape):
    def area(self):
        return "Triangle area"


shapes = [Circle(), Square(), Triangle()]
for shape in shapes:
    print(shape.area())


# Exercise 3:
'''Write a Singleton. Build an AppSettings Singleton holding a currency ("ETB") and confirm two 
instances are the same object'''

print("\n# Exercise 3:")

class AppSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance


a = AppSettings()
b = AppSettings()

print(a.currency)
print(a is b)


# Exercise 4:
'''Write a Factory. Create a ShapeFactory.create(kind) that returns a Circle, Square, or 
Triangle.'''

print("\n# Exercise 4:")

class ShapeFactory:
    @staticmethod
    def create(kind):
        if kind == "circle":
            return Circle()
        elif kind == "square":
            return Square()
        elif kind == "triangle":
            return Triangle()
        return None


shape = ShapeFactory.create("square")
print(shape.area())


# Exercise 5:
'''Write an Observer pair. Make a NewsAgency subject and two subscriber classes that print when 
notified.'''

print("\n# Exercise 5:")

class NewsAgency:
    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def notify(self, news):
        for subscriber in self.subscribers:
            subscriber.update(news)


class Subscriber1:
    def update(self, news):
        print("Subscriber1:", news)


class Subscriber2:
    def update(self, news):
        print("Subscriber2:", news)


agency = NewsAgency()
agency.subscribe(Subscriber1())
agency.subscribe(Subscriber2())

agency.notify("Breaking News!")