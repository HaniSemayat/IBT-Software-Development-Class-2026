using AddisEats.Api.Validation;
using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Models.Dtos;

public class OrderLineRequest
{
    [Range(1, int.MaxValue,
        ErrorMessage = "MenuItemId must be a positive integer.")]
    public int MenuItemId { get; set; }

    [Range(1, 50,
        ErrorMessage = "Each item quantity must be between 1 and 50.")]
    public int Qty { get; set; }
}

public class CreateOrderRequest : IValidatableObject
{
    [Range(1, int.MaxValue,
        ErrorMessage = "Select a valid restaurant.")]
    public int RestaurantId { get; set; }

    [Required(ErrorMessage = "A delivery area is required.")]
    [StringLength(60, MinimumLength = 2,
        ErrorMessage = "Area must contain between 2 and 60 characters.")]
    [RegularExpression(
        "^(Bole|Piassa|Kazanchis|Megenagna)$",
        ErrorMessage = "Choose a supported delivery area.")]
    public string Area { get; set; } = "";

    [Required(ErrorMessage = "A customer phone number is required.")]
    [EthiopianMobile]
    public string Phone { get; set; } = "";

    [Required(ErrorMessage = "An order must contain at least one item.")]
    [MinLength(1, ErrorMessage = "An order must contain at least one item.")]
    public List<OrderLineRequest> Items { get; set; } = new();

    [StringLength(300,
        ErrorMessage = "Notes cannot exceed 300 characters.")]
    public string? Notes { get; set; }

    public bool IsScheduled { get; set; }

    public DateTime? ScheduledFor { get; set; }

    public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
    {
        if (IsScheduled && ScheduledFor is null)
        {
            yield return new ValidationResult(
                "A scheduled order must include a delivery time.",
                new[] { nameof(ScheduledFor) });
        }

        if (!IsScheduled && ScheduledFor is not null)
        {
            yield return new ValidationResult(
                "ScheduledFor can only be supplied for a scheduled order.",
                new[] { nameof(ScheduledFor) });
        }
    }
}

public class UpdateOrderStatusRequest
{
    [Required(ErrorMessage = "An order status is required.")]
    [RegularExpression(
        "^(Placed|Preparing|Ready|Delivered|Cancelled)$",
        ErrorMessage = "Choose a supported order status.")]
    public string Status { get; set; } = "";
}
