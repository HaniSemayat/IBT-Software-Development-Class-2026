using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public interface IMenuService
{
    IReadOnlyList<MenuItem> GetByRestaurantId(int restaurantId);
}
