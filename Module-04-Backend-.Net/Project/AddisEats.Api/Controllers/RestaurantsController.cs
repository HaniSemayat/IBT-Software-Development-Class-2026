using AddisEats.Api.Common;
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
    private readonly IRestaurantService _restaurants;
    private readonly IMenuService _menu;

    public RestaurantsController(
        IRestaurantService restaurants,
        IMenuService menu)
    {
        _restaurants = restaurants;
        _menu = menu;
    }

    [HttpGet]
    public ActionResult<PagedResult<RestaurantDto>> GetAll(
        [FromQuery] RestaurantQuery query)
    {
        if (query.MaxFeeEtb < 0)
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

        if (!string.IsNullOrWhiteSpace(query.Sort)
            && !allowedSorts.Contains(query.Sort.Trim(),
                StringComparer.OrdinalIgnoreCase))
        {
            return ApiProblems.Result(
                HttpContext, 400, "VALIDATION_FAILED",
                "Unsupported sort field",
                "Sort must be name, -name, deliveryFeeEtb, or -deliveryFeeEtb.");
        }

        query.Limit = Math.Min(query.Limit, 100);

        var data = _restaurants.Search(query)
            .Select(r => r.ToDto())
            .ToList();

        return Ok(new PagedResult<RestaurantDto>(
            data,
            query.Page,
            query.Limit,
            _restaurants.CountAll(query)));
    }

    [HttpGet("{id:int:min(1)}")]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var result = _restaurants.GetById(id);

        if (!result.IsSuccess)
            return ApiProblems.Result(HttpContext, result.Error!);

        return Ok(result.Value!.ToDto());
    }

    [HttpGet("{id:int:min(1)}/menu")]
    public IActionResult GetMenu(int id)
    {
        var restaurant = _restaurants.GetById(id);

        if (!restaurant.IsSuccess)
            return ApiProblems.Result(HttpContext, restaurant.Error!);

        var items = _menu.GetByRestaurantId(id)
            .Select(item => item.ToDto())
            .ToList();

        return Ok(items);
    }
}
