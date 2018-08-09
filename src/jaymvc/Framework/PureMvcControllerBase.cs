using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace jaymvc.Framework
{

    public abstract class PureMvcControllerBase: Controller
    { 
        protected readonly ILogger Logger;
        protected PureMvcControllerBase(ILoggerFactory logging)
        {
            Logger = logging.CreateLogger(GetType());
        }
        
        /// <summary>
        /// function to derive the name from the model class;
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        private static string GetName(object model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));

            Type t = model.GetType();
            string name = t.Name;
            if (t.IsGenericType)
            {
                name = name.Substring(0, name.IndexOf("`", StringComparison.Ordinal));
                var gentype = t.GetGenericArguments();
                name = gentype.Aggregate(name, (current, type) => $"{current}Of{type.Name}");
            }
            return name;
        }
        [NonAction]
        public override ViewResult View(string viewName, object model)
        {
            
            ViewData.Model = model;
            if (viewName == null && model != null)
            {
                viewName = $"{GetName(model)}View";
            } 
            else if (model == null)
            {
                Logger.LogWarning($"View called without a model and view name {viewName}");
            }
            return new ViewResult
            {
                ViewName = viewName,
                ViewData = ViewData
            };           
        }
        [NonAction]
        public override PartialViewResult PartialView(string viewName, object model)
        {
            ViewData.Model = model;
            if (viewName == null && model != null)
            {
                viewName = $"{GetName(model)}Partial";
            } 
            else if (model == null)
            {
                Logger.LogWarning($"ParitalView called without a model and view name {viewName}.");
            }
            return new PartialViewResult
            {
                ViewName = viewName,
                ViewData = ViewData
            };
        }
    }
}