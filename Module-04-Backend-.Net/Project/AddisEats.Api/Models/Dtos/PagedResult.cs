namespace AddisEats.Api.Models.Dtos;

public record PagedResult<T>(
    IReadOnlyList<T> Data,
    int Page,
    int PageSize,
    int Total
);
