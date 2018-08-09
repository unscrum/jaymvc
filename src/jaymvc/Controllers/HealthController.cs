using System.Diagnostics;
using jaymvc.Framework;
using jaymvc.Models.Health;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace jaymvc.Controllers
{
    public class HealthController : PureMvcControllerBase
    {

        public HealthController(ILoggerFactory loggerFactory) : base(loggerFactory)
        {
        }

        public ViewResult Index()
        {
            return View(new SimpleHealthCheck());
        }
        
        public ViewResult Error(string id)
        {
            Logger.LogWarning("Error Page Reached.");
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            if (exceptionFeature != null)
            {
                var routeWhereExceptionOccurred = exceptionFeature.Path;

                var exceptionThatOccurred = exceptionFeature.Error;

                Logger.LogWarning(exceptionThatOccurred,
                    $"Error Page Reached with statuscode {id} on route {routeWhereExceptionOccurred}.");
            }
            else if (id != "404")
            {
                Logger.LogWarning($"Error Page Reached with statuscode {id}.");
            }

            return View(new ErrorPage(id, Activity.Current?.Id ?? HttpContext.TraceIdentifier));
        }
    }
}