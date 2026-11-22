# Addis Eats API

A RESTful ASP.NET Core Web API built with C# and .NET 8 for the Addis Eats food delivery application.

## Features

- Restaurant listing and searching
- Area filtering
- Pagination
- Restaurant details
- Restaurant menu endpoints
- DTO mapping to protect internal data
- Dependency injection
- In-memory data storage
- CORS configuration for the frontend
- Swagger API documentation

## Project Structure

```text
AddisEats.Api/
+-- Controllers/
¦   +-- RestaurantsController.cs
+-- Data/
¦   +-- RestaurantStore.cs
¦   +-- MenuStore.cs
+-- Models/
¦   +-- Restaurant.cs
¦   +-- MenuItem.cs
¦   +-- Dtos/
¦       +-- RestaurantDto.cs
¦       +-- MappingExtensions.cs
+-- Services/
¦   +-- IRestaurantService.cs
¦   +-- RestaurantService.cs
¦   +-- IMenuService.cs
¦   +-- MenuService.cs
+-- Program.cs
+-- AddisEats.Api.http
+-- README.md
```

## Run the API

Requirements: .NET 8 SDK.

```bash
dotnet restore
dotnet run --no-launch-profile --urls http://localhost:5217
```

Swagger UI:

`http://localhost:5217/swagger`

## API Endpoints

### 1. Get restaurants

`GET /api/v1/restaurants`

Returns active restaurants.

Success: `200 OK`

### 2. Search and paginate restaurants

`GET /api/v1/restaurants?area=Bole&page=1&limit=5`

Query parameters:

| Parameter | Description | Default |
|---|---|---|
| area | Optional restaurant area filter | None |
| page | Page number, minimum 1 | 1 |
| limit | Number of results, between 1 and 100 | 20 |

Success: `200 OK`

### 3. Get restaurant by ID

`GET /api/v1/restaurants/{id}`

Success: `200 OK`

Failure: `404 Not Found` if the restaurant does not exist or is inactive.

### 4. Get restaurant menu

`GET /api/v1/restaurants/{id}/menu`

Success: `200 OK`, including an empty array when the restaurant exists but has no menu items.

Failure: `404 Not Found` when the restaurant does not exist or is inactive.

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 404 | Restaurant not found |

## DTO and Data Protection

The public RestaurantDto contains only:

- Id
- Name
- Area
- DeliveryFeeEtb

Internal fields such as OwnerPhone and CommissionRate are never exposed by the restaurant endpoints.

## Pagination

Results are sorted alphabetically by restaurant name before pagination. The API supports area filtering and limits page size to a maximum of 100.

## CORS

The `frontend` policy allows requests from:

`http://localhost:5173`

It allows any HTTP header and method from that origin.

## Data

The API uses in-memory sample data. Restaurants and menu items are stored in the Data folder. Restaurant 12 intentionally has no menu items to demonstrate the empty-menu response.

## Notes

This is the initial API implementation for the Addis Eats capstone. The data layer can be replaced with a database in later development days.
