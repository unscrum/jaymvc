using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using jaymvc.Framework;
using jaymvc.Models.Home;
using jaymvc.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace jaymvc.Controllers
{
    public class HomeController : PureMvcControllerBase
    {
        private readonly ITodoService _todoService;

        public HomeController(ILoggerFactory logging, ITodoService todoService) : base(logging)
        {
            _todoService = todoService;
        }
        
        public ViewResult Index()
        {
            return View(new Home("World"));
        }
    }
}
