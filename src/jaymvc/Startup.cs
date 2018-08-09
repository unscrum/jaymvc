using System;
using jaymvc.Extensions;
using jaymvc.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace jaymvc
{
    public class Startup
    {
        private readonly IHostingEnvironment _hostingEnvironment;


        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddSingleton<ITodoService, TodoService>()
                .Configure<MvcOptions>(o =>
                {
                    // Set LocalTest:skipSsl to true to skip Ssl requrement in
                    // debug mode. This is useful when not using Visual Studio.
                    if (!_hostingEnvironment.IsDevelopment())
                        o.Filters.Add(new RequireHttpsAttribute());
                })
                .AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logging, IServiceProvider svc)
        {
            if (env.IsDevelopment())
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

            logging.AddAzureWebAppDiagnostics();
            logging.AddApplicationInsights(svc);
        }
    }
}
