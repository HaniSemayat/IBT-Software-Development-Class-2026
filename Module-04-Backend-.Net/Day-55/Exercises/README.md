# Day 55 - Exercises

**Track:** .NET (C#)  
**Module:** 4 - Backend  
**Project:** Addis Eats API  
**Day:** 55 - Building the First API

All eight exercises are implemented in the Addis Eats API project in this repository.

Project folder: [AddisEats.Api](../AddisEats.Api/)

## Exercise 1 - Scaffold the API

Created the ASP.NET Core Web API using controller-based routing.

Created the required folders:

- Controllers
- Services
- Models
- Models/Dtos
- Data

Removed the WeatherForecast template files and added the .NET Git ignore file.

## Exercise 2 - Restaurant Entity and DTO

Created the Restaurant entity with its internal properties.

Created RestaurantDto and mapping extension methods.

The public DTO intentionally excludes OwnerPhone and CommissionRate.

## Exercise 3 - Seed Restaurant Data

Added 12 sample restaurants across:

- Bole
- Piassa
- Kazanchis
- Megenagna

Each restaurant has a name, area, delivery fee, and internal owner information.

## Exercise 4 - Restaurant Service

Created IRestaurantService and RestaurantService.

Implemented:

- Search
- GetById
- CountAll

Registered the service using scoped dependency injection.

## Exercise 5 - Restaurant Listing Endpoint

Implemented:

`GET /api/v1/restaurants`

Supports optional area filtering, pagination, and alphabetical ordering.

Example:

`GET /api/v1/restaurants?area=Bole&page=1&limit=5`

Page 2 can be requested using `page=2`.

## Exercise 6 - Restaurant Menu Endpoint

Implemented:

`GET /api/v1/restaurants/{id}/menu`

The controller first checks whether the restaurant exists.

- A missing restaurant returns 404 Not Found.
- An existing restaurant with no menu items returns 200 OK with an empty array.

**Difference:** 404 means the requested parent resource does not exist, while 200 with an empty array means the parent exists but currently has no menu items.

Restaurant 12 is used to demonstrate the empty-menu case.

## Exercise 7 - HTTP Request File

Created `AddisEats.Api.http` with requests for:

- All restaurants
- Filtered and paginated restaurants
- One restaurant
- A missing restaurant (404)
- Restaurant menu
- Empty restaurant menu
- Second page

## Exercise 8 - CORS Configuration

Added a CORS policy named `frontend`.

Allowed frontend origin:

`http://localhost:5173`

The policy allows any header and HTTP method.

The API is configured to accept requests from the Module 3 React/Vite development server.

## Submission

The complete implementation is in [AddisEats.Api](../AddisEats.Api/).

See its README for setup instructions, endpoint documentation, query parameters, and response status codes.
