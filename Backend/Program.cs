using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;

var builder = WebApplication.CreateBuilder(args);
var frontendUrl = builder.Configuration.GetValue<string>("FrontendSettings:FrontendUrl");

if (string.IsNullOrEmpty(frontendUrl))
{
    // Handle the case where frontendUrl is missing
    frontendUrl = "";  // Set a fallback URL
}

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure MySQL
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

//Configure mongo db
var config = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

if (config != null && config.AtlasURI !=null && config.DatabaseName != null)
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMongoDB(config.AtlasURI, config.DatabaseName));
}

//cors setup
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

//Uncomment for making migration for sql
//using (var scope = app.Services.CreateScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    dbContext.Database.Migrate();  
//}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
