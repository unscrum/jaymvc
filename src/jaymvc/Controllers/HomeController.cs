using jaymvc.Framework;
using jaymvc.Models.Home;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace jaymvc.Controllers;

public class HomeController : PureMvcControllerBase
{
    public HomeController(ILoggerFactory logging) : base(logging)
    {
    }
        
    public ViewResult Index()
    {
        return View(new Home("World"));
    }
}