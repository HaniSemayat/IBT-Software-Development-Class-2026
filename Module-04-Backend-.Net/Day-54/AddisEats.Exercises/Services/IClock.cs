namespace AddisEats.Api.Services;

public interface IClock
{
    DateTime UtcNow { get; }
}
