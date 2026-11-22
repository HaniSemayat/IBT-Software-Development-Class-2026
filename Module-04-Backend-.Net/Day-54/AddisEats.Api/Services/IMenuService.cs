using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public interface IMenuService
{
    IReadOnlyList<MenuItem> GetAll(string? category);
    MenuItem? GetById(int id);
    MenuItem Create(CreateMenuItemRequest request);
}
