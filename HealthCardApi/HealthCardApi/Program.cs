using HealthCardApi.Models;
using HealthCardApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using myApi.Data;
using myApi.Repository;
using NLog.Extensions.Logging;
using NLog.Web;
using System.Text;

var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger(); // .NET 6 
//var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings();        //.NET 8

try
{
    var builder = WebApplication.CreateBuilder(args);


    var issuer = builder.Configuration["AuthenticationJWT:Issuer"];
    var audience = builder.Configuration["AuthenticationJWT:Audience"];
    var secretkey = builder.Configuration["AuthenticationJWT:SecretKey"];
    var expiration = TimeSpan.Parse(builder.Configuration["AuthenticationJWT:Expiration"]);

    builder.Services.AddSingleton<JWTOptions>(new JWTOptions(issuer, audience, secretkey, expiration));
    // JWT Auth
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey))
        };
    });

    //Controllers
    builder.Services.AddControllers();
    //MVC
    builder.Services.AddMvc();
    //Services
    builder.Services.AddScoped<ImyApiRepository, myApiRepository>();
    builder.Services.AddScoped<IJWTService, JWTService>();
    //Db Connection
    builder.Services.AddDbContext<myApiDbContext>(options =>
    options.UseSqlServer("Data Source=;Initial Catalog=HealthApp;Encrypt=False;Integrated Security=True"));

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    //Logging
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
