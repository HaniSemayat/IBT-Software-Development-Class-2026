using AddisEats.Api.Common;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Queries;

namespace AddisEats.Api.Services;

public interface IRestaurantService
{
    IReadOnlyList<Restaurant> Search(RestaurantQuery query);

    Result<Restaurant> GetById(int id);

    int CountAll(RestaurantQuery query);
}
