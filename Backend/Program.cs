using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models.Configurations;
using Backend.Helpers;

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

//for JWT auth
var secretKey = builder.Configuration.GetValue<string>("JWTSettings:SecretKey") ?? throw new Exception("JWT Secret Key is not configured.");
JwtTokenHelper.SetSecretKey(secretKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = 
        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
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

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
