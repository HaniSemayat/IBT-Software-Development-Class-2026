using AddisEats.Api.Models.Dtos;
using AddisEats.Api.Models.Queries;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
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
    public ActionResult<PagedResult<RestaurantDto>> GetAll(
        [FromQuery] RestaurantQuery q)
    {
        var results = _restaurantService
            .Search(q)
            .Select(r => r.ToDto())
            .ToList();

        var response = new PagedResult<RestaurantDto>(
            results,
            q.Page,
            q.Limit,
            _restaurantService.CountAll(q)
        );

        return Ok(response);
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var restaurant = _restaurantService.GetById(id);

        if (restaurant is null)
            return NotFound(new { message = $"Restaurant {id} was not found." });

        return restaurant.ToDto();
    }

    [HttpGet("{id:int:min(1)}/menu")]
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
