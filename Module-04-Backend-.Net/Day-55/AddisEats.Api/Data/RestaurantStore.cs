using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public static class RestaurantStore
{
    public static readonly List<Restaurant> Restaurants = new()
    {
        new() { Id = 1, Name = "Habesha Kitchen", Area = "Bole", DeliveryFeeEtb = 45, OwnerPhone = "0911000001", CommissionRate = 0.10m },
        new() { Id = 2, Name = "Bole Bistro", Area = "Bole", DeliveryFeeEtb = 50, OwnerPhone = "0911000002", CommissionRate = 0.12m },
        new() { Id = 3, Name = "Addis Garden", Area = "Bole", DeliveryFeeEtb = 40, OwnerPhone = "0911000003", CommissionRate = 0.10m },
        new() { Id = 4, Name = "Mama's Injera", Area = "Bole", DeliveryFeeEtb = 35, OwnerPhone = "0911000004", CommissionRate = 0.08m },
        new() { Id = 5, Name = "Piassa Traditional", Area = "Piassa", DeliveryFeeEtb = 30, OwnerPhone = "0911000005", CommissionRate = 0.10m },
        new() { Id = 6, Name = "Blue Nile Cafe", Area = "Piassa", DeliveryFeeEtb = 35, OwnerPhone = "0911000006", CommissionRate = 0.11m },
        new() { Id = 7, Name = "Taitu Restaurant", Area = "Piassa", DeliveryFeeEtb = 40, OwnerPhone = "0911000007", CommissionRate = 0.10m },
        new() { Id = 8, Name = "Kazanchis Grill", Area = "Kazanchis", DeliveryFeeEtb = 55, OwnerPhone = "0911000008", CommissionRate = 0.12m },
        new() { Id = 9, Name = "Urban Plate", Area = "Kazanchis", DeliveryFeeEtb = 45, OwnerPhone = "0911000009", CommissionRate = 0.10m },
        new() { Id = 10, Name = "Megenagna Bites", Area = "Megenagna", DeliveryFeeEtb = 50, OwnerPhone = "0911000010", CommissionRate = 0.09m },
        new() { Id = 11, Name = "Family Kitchen", Area = "Megenagna", DeliveryFeeEtb = 40, OwnerPhone = "0911000011", CommissionRate = 0.10m },
        new() { Id = 12, Name = "New Horizon Cafe", Area = "Megenagna", DeliveryFeeEtb = 30, OwnerPhone = "0911000012", CommissionRate = 0.08m }
    };
}
