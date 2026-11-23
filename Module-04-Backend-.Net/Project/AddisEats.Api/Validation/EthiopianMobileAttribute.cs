using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace AddisEats.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class EthiopianMobileAttribute : ValidationAttribute
{
    private static readonly Regex Pattern = new(
        @"^(?:(?:\+251|0)(?:9|7)\d{8})$",
        RegexOptions.Compiled | RegexOptions.CultureInvariant);

    public EthiopianMobileAttribute()
    {
        ErrorMessage = "Enter a valid Ethiopian mobile number.";
    }

    protected override ValidationResult? IsValid(
        object? value,
        ValidationContext validationContext)
    {
        if (value is string phone && Pattern.IsMatch(phone))
            return ValidationResult.Success;

        return new ValidationResult(
            ErrorMessage ?? "Enter a valid Ethiopian mobile number.");
    }
}
