using System;
using jaymvc.Extensions;
using jaymvc.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace jaymvc
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public Startup(IConfiguration configuration, IWebHostEnvironment hostingEnvironment)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddApplicationInsightsTelemetry(_configuration)
                .AddHttpContextAccessor()
                .AddSingleton<ITodoService, TodoService>() 
                .Configure<MvcOptions>(o =>
                {
                    // Set LocalTest:skipSsl to true to skip Ssl requrement in
                    // debug mode. This is useful when not using Visual Studio.
                    if (!_hostingEnvironment.IsDevelopment())
                        o.Filters.Add(new RequireHttpsAttribute());
                })
                .AddMvc(o=>o.EnableEndpointRouting = false)
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory logging, IServiceProvider sp)
        {
            if (_hostingEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Health/Error/500");
            }

            app.UseStatusCodePages(async ctx =>
            {
                if (ctx.HttpContext.Request.IsAjaxRequest())
                {
                    if (ctx.HttpContext.Request.IsAjaxHtml())
                    {
                        ctx.HttpContext.Response.ContentType = "text/html";

                        await ctx.HttpContext.Response.WriteAsync("<h1>Redirecting...</h1>");

                    }
                    else
                    {
                        ctx.HttpContext.Response.ContentType = "application/json";

                        await ctx.HttpContext.Response.WriteAsync("{}");
                    }
                }
                else
                {
                    ctx.HttpContext.Response.Redirect($"/Health/Error/{ctx.HttpContext.Response.StatusCode}");
                }
            });

            app.UseAuthentication();
            app.UseStaticFiles();

            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            var logger = logging.CreateLogger<Startup>();
            try
            {
                using var scope = sp.CreateScope();
                scope.ServiceProvider.GetRequiredService<ITodoService>();
                logger.LogInformation("Startup Jay MVC Succeeded.");
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Startup Jay MVC Failed{NewLine}{Error}", Environment.NewLine, ex.ToString());
            }
        }
    }
}
