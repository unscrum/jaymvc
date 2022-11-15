using System;
using Microsoft.AspNetCore.Http;

namespace jaymvc.Extensions;

public static class FrameworkExtensions
{
    public static bool IsAjaxRequest(this HttpRequest request)
    {
        if (!string.Equals(request.Query["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal))
            return string.Equals(request.Headers["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal);
        return true;
    }
        
    public static bool IsAjaxHtml(this HttpRequest request)
    {
        if (!string.Equals(request.Query["Accept"], "text/html, */*; q=0.01", StringComparison.Ordinal))
            return string.Equals(request.Headers["Accept"], "text/html, */*; q=0.01", StringComparison.Ordinal);
        return true;
    }
}