using AddisEats.Api.Common;
using AddisEats.Api.Models;
using AddisEats.Api.Models.Dtos;

namespace AddisEats.Api.Services;

public interface IOrderService
{
    Result<Order> GetById(int id);

    Result<Order> Place(CreateOrderRequest request);

    Result<Order> UpdateStatus(int id, OrderStatus status);
}
