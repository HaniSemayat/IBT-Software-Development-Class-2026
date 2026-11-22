namespace AddisEats.Api.Services;

public class CapturedClock : IClock
{
    private readonly DateTime _capturedTime = DateTime.UtcNow;

    public DateTime UtcNow => _capturedTime;
}
