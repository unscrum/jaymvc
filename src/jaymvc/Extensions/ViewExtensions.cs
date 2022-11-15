using System;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace jaymvc.Extensions;

public static class ViewExtensions
{
    public static string ShortDate(this DateTime dt)
    {
        if (dt == DateTime.MinValue)
            return "";
            
        return dt.ToShortDateString();
    }
        
    private static string[] ParseList(this string list)
    {
        if (string.IsNullOrWhiteSpace(list))
            return null;

        return list.Split(",").Where(p => !string.IsNullOrWhiteSpace(p)).Select(p => p.Trim()).ToArray();
    }

    private const string ScriptFormat = "<script type=\"text/javascript\" src=\"/js/Views/{0}.js?ts={1}\"></script>";
    private const string CcsFormat = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/Views/{0}.css?ts={1}\" />";
    private static string ViewsThing(this IUrlHelper helper, string list, string format)
    {
        var p = ParseList(list);
        if (p == null || p.Length == 0)
            return string.Empty;

        using var scope = helper.ActionContext.HttpContext.RequestServices.CreateScope();
        var hosting = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
                
        return string.Join("\n", p.Select(q => string.Format(format, q, hosting.IsDevelopment() ? DateTime.Now.Ticks : DateTime.Today.Ticks)));
    }
    public static HtmlString ViewJavascript(this IUrlHelper helper, string list)
    {
        return new HtmlString(helper.ViewsThing(list,ScriptFormat));
    }
    public static HtmlString ViewStyles(this IUrlHelper helper, string list)
    {
        return new HtmlString(helper.ViewsThing(list,CcsFormat));
    }
}