using AddisEats.Api.Common;
using AddisEats.Api.Data;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Queries;

namespace AddisEats.Api.Services;

public class RestaurantService : IRestaurantService
{
    public IReadOnlyList<Restaurant> Search(RestaurantQuery query)
    {
        var results = ApplyFilters(query);

        IOrderedQueryable<Restaurant> ordered =
            query.Sort?.Trim() switch
            {
                "-name" => results.OrderByDescending(r => r.Name),
                "deliveryFeeEtb" => results.OrderBy(r => r.DeliveryFeeEtb),
                "-deliveryFeeEtb" => results.OrderByDescending(r => r.DeliveryFeeEtb),
                _ => results.OrderBy(r => r.Name)
            };

        return ordered
            .Skip((query.Page - 1) * query.Limit)
            .Take(query.Limit)
            .ToList();
    }

    public Result<Restaurant> GetById(int id)
    {
        var restaurant = RestaurantStore.Restaurants
            .FirstOrDefault(r => r.Id == id && r.IsActive);

        if (restaurant is null)
        {
            return Result<Restaurant>.Fail(
                "RESTAURANT_NOT_FOUND",
                $"Restaurant {id} was not found.",
                404);
        }

        return Result<Restaurant>.Ok(restaurant);
    }

    public int CountAll(RestaurantQuery query)
    {
        return ApplyFilters(query).Count();
    }

    private static IQueryable<Restaurant> ApplyFilters(
        RestaurantQuery query)
    {
        var results = RestaurantStore.Restaurants
            .AsQueryable()
            .Where(r => r.IsActive);

        if (!string.IsNullOrWhiteSpace(query.Area))
        {
            results = results.Where(r =>
                r.Area.Equals(
                    query.Area.Trim(),
                    StringComparison.OrdinalIgnoreCase));
        }

        if (query.Areas.Count > 0)
        {
            results = results.Where(r =>
                query.Areas.Any(area =>
                    area.Equals(
                        r.Area,
                        StringComparison.OrdinalIgnoreCase)));
        }

        if (query.MaxFeeEtb.HasValue)
        {
            results = results.Where(r =>
                r.DeliveryFeeEtb <= query.MaxFeeEtb.Value);
        }

        return results;
    }
}
