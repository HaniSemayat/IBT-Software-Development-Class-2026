using AddisEats.Api.Models;
using AddisEats.Api.Services;
using AddisEats.Api.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/menu")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly MenuOptions _options;

    public MenuController(IMenuService menuService, IOptions<MenuOptions> options)
    {
        _menuService = menuService;
        _options = options.Value;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] string? category, [FromQuery] int page = 1)
    {
        if (page <= 0)
        {
            return BadRequest(new { Message = "Page must be positive." });
        }

        var items = _menuService.GetAll(category)
            .Skip((page - 1) * _options.DefaultPageSize)
            .Take(_options.DefaultPageSize)
            .ToList();

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById([FromRoute] int id)
    {
        var item = _menuService.GetById(id);

        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateMenuItemRequest request)
    {
        if (request.PriceEtb <= 0m)
        {
            return BadRequest(new { Message = "PriceEtb must be greater than zero." });
        }

        var item = _menuService.Create(request);

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }
}
