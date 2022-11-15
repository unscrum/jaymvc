using System.Collections.Generic;

namespace jaymvc.Framework;

/// <summary>
/// An Envelope wrapper for Json responses that allows for Friendly AJAX errors to be handled differently than failures.
/// </summary>
public class JsonEnvelope
{
    /// <summary>
    /// The Private constructor.
    /// </summary>
    /// <param name="success">Is it a successful call or an error call.</param>
    /// <param name="data">The data.</param>
    private JsonEnvelope(bool success, object data = null):this(success ? "success" : "error")
    {
        this.data = data ?? new object();
    }

    private JsonEnvelope(string status)
    {
        this.status = status;
    }

    /// <summary>
    /// The JSON data, purposefully lowercase since  it works with Ajax jquery library, do not change.
    /// </summary>
    // ReSharper disable once MemberCanBePrivate.Global
    // ReSharper disable once InconsistentNaming
    // ReSharper disable once UnusedAutoPropertyAccessor.Global
    public object data { get; }



    /// <summary>
    /// The status, error or success, lowercase since it works with Ajax jquery library, do not change.
    /// </summary>
    // ReSharper disable once MemberCanBePrivate.Global
    // ReSharper disable once InconsistentNaming
    // ReSharper disable once UnusedAutoPropertyAccessor.Global
    public string status { get; }

    /// <summary>
    /// A successful call with no data passed back.
    /// </summary>
    /// <returns>A new Json Envelope</returns>
    public static JsonEnvelope Success()
    {
        return new JsonEnvelope(true);
    }

    /// <summary>
    /// A successful call with data passed back.
    /// </summary>
    /// <param name="data">Any Json Serializable Object</param>
    /// <returns>A new Json Envelope</returns>
    public static JsonEnvelope Success(object data)
    {
        return new JsonEnvelope(true, data);
    }

    /// <summary>
    /// An error call with a string message passed back.
    /// </summary>
    /// <param name="message">The error message.</param>
    /// <returns>A new Json Envelope</returns>
    public static JsonEnvelope Error(string message)
    {
        return new JsonEnvelope(false, message);
    }
        
    /// <summary>
    /// An error call with a string message passed back.
    /// </summary>
    /// <param name="data">The data object.</param>
    /// <returns>A new Json Envelope</returns>
    public static JsonEnvelope Error(object data)
    {
        return new JsonEnvelope(false, data);
    }

    /// <summary>
    /// An  call with a several different message passed back, oen per html input.
    /// </summary>
    /// <param name="fieldNameErrorMessagePairs">A list of field names with error message tied to each one, like "Name", "Name is required" useful for validating input.</param>
    /// <returns>A new Json Envelope</returns>
    public static JsonEnvelope Error(IEnumerable<KeyValuePair<string, string>> fieldNameErrorMessagePairs)
    {
        return new JsonEnvelope(false, fieldNameErrorMessagePairs);
    }


}