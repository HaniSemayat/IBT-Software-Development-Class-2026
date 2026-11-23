namespace AddisEats.Api.Errors;

public sealed class NotFoundException : Exception
{
    public string Code { get; }

    public NotFoundException(string code, string message)
        : base(message)
    {
        Code = code;
    }
}

public sealed class PaymentDeclinedException : Exception
{
    public PaymentDeclinedException(string message)
        : base(message) { }
}

public sealed class GatewayUnreachableException : Exception
{
    public GatewayUnreachableException(string message)
        : base(message) { }
}
