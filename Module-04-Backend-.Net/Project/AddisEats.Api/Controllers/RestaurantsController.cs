using AddisEats.Api.Errors;
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
        if (q.Page < 1)
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Invalid page",
                "Page must be 1 or greater.");
        }

        if (q.Limit < 1)
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Invalid limit",
                "Limit must be 1 or greater.");
        }

        if (q.MaxFeeEtb < 0)
        {
            return ApiProblems.Result(
                HttpContext, 422, "AMOUNT_INVALID",
                "Invalid delivery fee",
                "Maximum delivery fee cannot be negative.");
        }

        var allowedSorts = new[]
        {
            "name", "-name",
            "deliveryFeeEtb", "-deliveryFeeEtb"
        };

        if (!string.IsNullOrWhiteSpace(q.Sort)
            && !allowedSorts.Contains(q.Sort.Trim(),
                StringComparer.OrdinalIgnoreCase))
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Unsupported sort field",
                "Sort must be name, -name, deliveryFeeEtb, or -deliveryFeeEtb.");
        }

        // A requested limit above 100 is capped at 100.
        q.Limit = Math.Min(q.Limit, 100);

        var results = _restaurantService
            .Search(q)
            .Select(r => r.ToDto())
            .ToList();

        var response = new PagedResult<RestaurantDto>(
            results,
            q.Page,
            q.Limit,
            _restaurantService.CountAll(q));

        return Ok(response);
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var restaurant = _restaurantService.GetById(id);

        if (restaurant is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "RESTAURANT_NOT_FOUND",
                "Restaurant not found",
                $"Restaurant {id} was not found.");
        }

        return Ok(restaurant.ToDto());
    }

    [HttpGet("{id:int:min(1)}/menu")]
    public IActionResult GetRestaurantMenu(int id)
    {
        var restaurant = _restaurantService.GetById(id);

        if (restaurant is null)
        {
            return ApiProblems.Result(
                HttpContext, 404, "RESTAURANT_NOT_FOUND",
                "Restaurant not found",
                $"Restaurant {id} was not found.");
        }

        var menu = _menuService
            .GetByRestaurantId(id)
            .Select(item => item.ToDto())
            .ToList();

        return Ok(menu);
    }
}
