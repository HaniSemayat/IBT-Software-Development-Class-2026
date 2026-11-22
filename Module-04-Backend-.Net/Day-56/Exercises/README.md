# Day 56 - Routing & Controllers Exercises

**Track:** .NET (C#)
**Module:** 4 - Backend
**Week:** 12
**Project:** Addis Eats API

All exercises are implemented against the permanent Addis Eats capstone project.

Permanent project: [AddisEats.Api](../../Project/AddisEats.Api/)

---

## Exercise 1 - Route Constraints

Added `:int:min(1)` constraints to restaurant ID route segments.

Examples:

- `GET /api/v1/restaurants/{id:int:min(1)}`
- `GET /api/v1/restaurants/{id:int:min(1)}/menu`

A request using `/api/v1/restaurants/abc` does not match the integer route and returns 404 Not Found.

