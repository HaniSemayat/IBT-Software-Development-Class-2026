# Addis Eats API

A RESTful Web API built with ASP.NET Core Web API and C# as part of IBT College Canada's Advanced Digital Skills Training – Module 4, Day 54.

The project demonstrates ASP.NET Core fundamentals, dependency injection, service lifetimes, configuration, authentication middleware, and REST API development.

## Technologies

- C#
- .NET 8
- ASP.NET Core Web API
- Controllers
- Dependency Injection
- Swagger / OpenAPI
- Configuration using `appsettings.json`
- In-memory data storage

## Getting Started

### Prerequisites

- .NET 8 SDK

### Run the Application

From the project directory:

```powershell
dotnet restore
dotnet build
dotnet run --urls http://localhost:5217
```

### Swagger UI

Once the application is running, open:

[http://localhost:5217/swagger](http://localhost:5217/swagger)

## API Endpoints

Base URL: `http://localhost:5217`

| Method | Endpoint | Description | Success | Other Responses |
|---|---|---|---|---|
| GET | `/api/v1/health` | Check API health and environment | 200 | — |
| GET | `/api/v1/payments/provider` | Get the registered payment provider | 200 | — |
| GET | `/api/v1/delivery/settings` | Get delivery configuration | 200 | — |
| GET | `/api/v1/menu` | Get menu items | 200 | 400 |
| GET | `/api/v1/menu?category=Beverage` | Filter menu by category | 200 | — |
| GET | `/api/v1/menu?page=2` | Get a menu page | 200 | 400 |
| GET | `/api/v1/menu/{id}` | Get a menu item by ID | 200 | 404 |
| POST | `/api/v1/menu` | Create a menu item | 201 | 400 |
| GET | `/api/v1/protected` | Access a protected endpoint | 200 | 401 |

## Example Requests

### Health Check

```http
GET /api/v1/health
```

Returns the current UTC time and application environment.

### Get All Menu Items

```http
GET /api/v1/menu
```

### Filter by Category

```http
GET /api/v1/menu?category=Main%20Course
```

### Get a Menu Item

```http
GET /api/v1/menu/1
```

### Create a Menu Item

```http
POST /api/v1/menu
Content-Type: application/json
```

Request body:

```json
{
  "name": "Kitfo",
  "category": "Main Course",
  "priceEtb": 550
}
```

A successful request returns **201 Created**, including the created item and its resource location.

A price of zero or less returns **400 Bad Request**.

### Protected Endpoint

```http
GET /api/v1/protected
X-Demo-Token: letmein
```

The endpoint requires the demo authentication token. Requests without a valid token are unauthorized.

## Configuration

Application settings are stored in `appsettings.json`.

### Menu Settings

```json
{
  "Menu": {
    "DefaultPageSize": 5
  }
}
```

Controls the default number of menu items returned per page.

### Delivery Settings

```json
{
  "Delivery": {
    "FreeAboveEtb": 1000,
    "DefaultFeeEtb": 80
  }
}
```

Defines the minimum order amount for free delivery and the default delivery fee.

These settings are bound to strongly typed options classes and injected where needed.

## Project Structure

```text
AddisEats.Api/
├── Authentication/
│   └── DemoAuthHandler.cs
├── Controllers/
│   ├── DeliveryController.cs
│   ├── HealthController.cs
│   ├── MenuController.cs
│   ├── PaymentsController.cs
│   └── ProtectedController.cs
├── Models/
│   ├── CreateMenuItemRequest.cs
│   └── MenuItem.cs
├── Options/
│   ├── DeliveryOptions.cs
│   └── MenuOptions.cs
├── Services/
│   ├── CapturedClock.cs
│   ├── CbeBirrProvider.cs
│   ├── IClock.cs
│   ├── IMenuService.cs
│   ├── IPaymentProvider.cs
│   ├── MenuService.cs
│   ├── SystemClock.cs
│   └── TeleBirrProvider.cs
├── Program.cs
├── appsettings.json
└── README.md
```

## Day 54 Learning Exercises

This project demonstrates the following concepts:

1. Creating an ASP.NET Core Web API project using controllers and Swagger.
2. Creating a health-check endpoint that returns UTC time and the hosting environment.
3. Using dependency injection to register and inject an `IClock` service.
4. Comparing transient, scoped, and singleton service lifetimes using a captured clock.
5. Implementing multiple payment providers and switching implementations through dependency injection.
6. Binding configuration sections to strongly typed options classes.
7. Observing the dependency injection error caused by a missing service registration.
8. Understanding the importance of authentication and authorization middleware order.

## Mini-Project: Addis Eats Menu API

The mini-project extends the exercises into a small restaurant menu API.

### Features

- Menu retrieval and category filtering.
- Pagination using configurable default page size.
- Retrieving a menu item by ID.
- Creating menu items.
- Price validation.
- Dependency injection through `IMenuService`.
- Strongly typed configuration using `MenuOptions`.

## Notes

- Menu data is stored in memory and resets when the application restarts.
- The demo authentication handler is for learning purposes only and is not suitable for production authentication.
- Prices use C# `decimal` to represent monetary values.
- No database is currently connected.

---

**Training:** IBT College Canada – Advanced Digital Skills Training  
**Module:** 4 – Backend Development with .NET  
**Day:** 54