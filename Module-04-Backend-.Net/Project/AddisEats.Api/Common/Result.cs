namespace AddisEats.Api.Common;

public sealed record Error(string Code, string Message, int Status);

public sealed class Result<T>
{
    public T? Value { get; private init; }
    public Error? Error { get; private init; }

    public bool IsSuccess => Error is null;

    public static Result<T> Ok(T value)
        => new() { Value = value };

    public static Result<T> Fail(string code, string message, int status)
        => new()
        {
            Error = new Error(code, message, status)
        };
}
