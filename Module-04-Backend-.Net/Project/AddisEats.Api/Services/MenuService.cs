using AddisEats.Api.Common;
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

    public Result<MenuItem> GetById(int id)
    {
        var item = MenuStore.Items.FirstOrDefault(x => x.Id == id);

        if (item is null)
        {
            return Result<MenuItem>.Fail(
                "MENU_ITEM_NOT_FOUND",
                $"Menu item {id} was not found.",
                404);
        }

        return Result<MenuItem>.Ok(item);
    }
}
