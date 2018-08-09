using System;
using Microsoft.AspNetCore.Mvc;

namespace jaymvc.Extensions
{
    public static partial class UrlExtensions
    {
        public static string Home(this IUrlHelper helper)
        {
            return helper.RouteUrl("default", new {controller = "Home", action = "Index"});
        }
        
        public static string PartialTodos(this IUrlHelper helper)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "All"});
        }
        
        public static string PartialEditTodo(this IUrlHelper helper, Guid id)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "Edit", id});
        }
        
        public static string PartialAddTodo(this IUrlHelper helper)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "Add"});
        }
        
        public static string JsonCompleteTodo(this IUrlHelper helper, Guid id)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "Complete", id});
        }
        
        public static string JsonSaveTodo(this IUrlHelper helper, Guid? id = null)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "Save", id});
        }
        
        public static string JsonAssigneeTypeAhead(this IUrlHelper helper, Guid? id = null)
        {
            return helper.RouteUrl("default", new {controller = "Todo", action = "TypeAhead", id});
        }
        
        public static string Health(this IUrlHelper helper)
        {
            return helper.RouteUrl("default", new {controller = "Health", action = "Index"});
        }

    }
}
