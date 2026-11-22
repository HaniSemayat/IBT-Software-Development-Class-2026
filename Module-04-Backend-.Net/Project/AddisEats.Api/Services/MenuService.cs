using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public class MenuService : IMenuService
{
    public IReadOnlyList<MenuItem> GetByRestaurantId(int restaurantId)
    {
        return MenuStore.Items
            .Where(item => item.RestaurantId == restaurantId)
            .OrderBy(item => item.Id)
            .ToList();
    }
}
