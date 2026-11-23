using AddisEats.Api.Validation;
using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Models;

public class Restaurant
{
    public int Id { get; init; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required]
    [StringLength(60, MinimumLength = 2)]
    public string Area { get; set; } = "";

    [EtbAmount]
    public decimal DeliveryFeeEtb { get; set; }

    public bool IsActive { get; set; } = true;

    // Active means the restaurant exists in the platform.
    // Open means it can accept orders right now.
    public bool IsOpen { get; set; } = true;

    public string OwnerPhone { get; set; } = "";

    public decimal CommissionRate { get; set; }
}
