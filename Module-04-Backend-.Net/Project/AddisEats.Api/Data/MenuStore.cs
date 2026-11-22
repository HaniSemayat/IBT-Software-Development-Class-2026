using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public static class MenuStore
{
    public static readonly List<MenuItem> Items = CreateItems();

    private static List<MenuItem> CreateItems()
    {
        var items = new List<MenuItem>();
        int id = 1;

        string[] names =
        {
            "Special Firfir",
            "Doro Wot",
            "Tibs",
            "Shiro",
            "Chechebsa",
            "Fresh Juice"
        };

        string[] descriptions =
        {
            "Traditional Ethiopian breakfast dish",
            "Classic Ethiopian chicken stew",
            "Seasoned and sautéed meat",
            "Traditional chickpea stew",
            "Traditional spiced flatbread",
            "Freshly prepared seasonal juice"
        };

        decimal[] prices = { 180, 450, 380, 160, 150, 100 };
        string[] categories = { "Breakfast", "Main", "Main", "Main", "Breakfast", "Drink" };

        for (int restaurantId = 1; restaurantId <= 11; restaurantId++)
        {
            for (int i = 0; i < 6; i++)
            {
                items.Add(new MenuItem(
                    id++,
                    restaurantId,
                    names[i],
                    descriptions[i],
                    prices[i],
                    categories[i],
                    true
                ));
            }
        }

        return items;
    }
}
