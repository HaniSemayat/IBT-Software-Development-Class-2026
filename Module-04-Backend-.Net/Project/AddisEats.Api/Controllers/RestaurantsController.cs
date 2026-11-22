using AddisEats.Api.Models.Dtos;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/restaurants")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;
    private readonly IMenuService _menuService;

    public RestaurantsController(
        IRestaurantService restaurantService,
        IMenuService menuService)
    {
        _restaurantService = restaurantService;
        _menuService = menuService;
    }

    [HttpGet]
    public IActionResult GetRestaurants(
        [FromQuery] string? area,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        page = Math.Max(1, page);
        limit = Math.Clamp(limit, 1, 100);

        var results = _restaurantService
            .Search(area, page, limit)
            .Select(r => r.ToDto())
            .ToList();

        return Ok(new
        {
            data = results,
            page,
            pageSize = limit,
            total = _restaurantService.CountAll(area)
        });
    }

    [HttpGet("{id:int}")]
    public IActionResult GetRestaurant(int id)
    {
        var restaurant = _restaurantService.GetById(id);

        if (restaurant is null)
            return NotFound(new { message = $"Restaurant {id} was not found." });

        return Ok(restaurant.ToDto());
    }

    [HttpGet("{id:int}/menu")]
    public IActionResult GetRestaurantMenu(int id)
    {
        var restaurant = _restaurantService.GetById(id);

        if (restaurant is null)
            return NotFound(new { message = $"Restaurant {id} was not found." });

        var menu = _menuService
            .GetByRestaurantId(id)
            .Select(item => item.ToDto())
            .ToList();

        return Ok(menu);
    }
}
