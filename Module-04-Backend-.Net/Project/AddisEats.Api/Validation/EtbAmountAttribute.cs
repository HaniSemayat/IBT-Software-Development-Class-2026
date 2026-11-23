using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class EtbAmountAttribute : ValidationAttribute
{
    public EtbAmountAttribute()
    {
        ErrorMessage = "Amount must be above zero and have at most two decimal places.";
    }

    protected override ValidationResult? IsValid(
        object? value,
        ValidationContext validationContext)
    {
        if (value is not decimal amount)
        {
            return new ValidationResult("Amount must be a decimal value.");
        }

        if (amount <= 0m)
        {
            return new ValidationResult("Amount must be above zero.");
        }

        if (decimal.Round(amount, 2) != amount)
        {
            return new ValidationResult("Amount can have at most two decimal places.");
        }

        return ValidationResult.Success;
    }
}
