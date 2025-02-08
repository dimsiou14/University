using Microsoft.EntityFrameworkCore;
using myApi.Data;
using myApi.Repository;
using NLog.Extensions.Logging;
using NLog.Web;

var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger(); // .NET 6 
//var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings();        //.NET 8

// Add services to the container.

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddControllers();
    builder.Services.AddMvc();
    builder.Services.AddScoped<ImyApiRepository, myApiRepository>();
    builder.Services.AddDbContext<myApiDbContext>(options =>
    options.UseSqlServer("Data Source=;Initial Catalog=HealthApp;Encrypt=False;Integrated Security=True"));
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddLogging(loggingBuilder =>
    {
        loggingBuilder.ClearProviders();
        loggingBuilder.AddNLog();
    });
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception exception)
{
    // NLog: catch setup errors
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    NLog.LogManager.Shutdown();
}
