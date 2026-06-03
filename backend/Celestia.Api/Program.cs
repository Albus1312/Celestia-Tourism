using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT Bearer Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "CelestiaSuperSecretEncryptionKey2026";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// 2. Configure Dual-Mode DB Connection (PostgreSQL with EF InMemory Fallback)
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=celestia;Username=postgres;Password=celestia";

if (!string.IsNullOrEmpty(connectionString) && (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://")))
{
    try
    {
        var uri = new Uri(connectionString);
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');
        
        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB ERROR] Error parsing DATABASE_URL URI: {ex.Message}");
    }
}

bool usePostgres = false;
try
{
    // Proactively inspect if PostgreSQL connection is operational by creating a temporary builder
    var testOptions = new DbContextOptionsBuilder<CelestiaDbContext>()
        .UseNpgsql(connectionString)
        .Options;
    
    using (var context = new CelestiaDbContext(testOptions))
    {
        // Try to establish connection for 2 seconds max to avoid hanging
        context.Database.SetCommandTimeout(2);
        if (context.Database.CanConnect())
        {
            usePostgres = true;
        }
    }
}
catch (Exception ex)
{
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine($"[DB WARN] Local PostgreSQL connection check failed: {ex.Message}");
    Console.WriteLine("[DB INFO] Falling back gracefully to Entity Framework Core IN-MEMORY Database.");
    Console.ResetColor();
}

if (usePostgres)
{
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("[DB INFO] Successfully connected to PostgreSQL! Using 'celestia' database.");
    Console.ResetColor();
    builder.Services.AddDbContext<CelestiaDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.WriteLine("[DB INFO] Using Microsoft EF Core IN-MEMORY Database for absolute reliability in demo mode.");
    Console.ResetColor();
    builder.Services.AddDbContext<CelestiaDbContext>(options =>
        options.UseInMemoryDatabase("CelestiaDb"));
}

// 3. Configure permissive CORS for Vite React client (Allow Any Origin since JWT is stateless and sent in Headers)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteClient", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 4. Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // Enable swagger always for demo convenience
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure database is created and seeded on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CelestiaDbContext>();
        DataSeeder.Seed(context);
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[SEED] Database initialized and seeded successfully with rich Vietnam travel data!");
        Console.ResetColor();
    }
    catch (Exception ex)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"[SEED ERROR] Failed to seed database: {ex.Message}");
        Console.ResetColor();
    }
}

app.UseCors("AllowViteClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Add a quick diagnostic health check endpoint
app.MapGet("/api/health", () => new { 
    status = "Healthy", 
    mode = usePostgres ? "PostgreSQL" : "InMemory", 
    timestamp = DateTime.UtcNow 
});

// Redirect root to Swagger UI for better UX
app.MapGet("/", () => Results.Redirect("/swagger/index.html"));

app.Run();
