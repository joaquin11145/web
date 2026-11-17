using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Forzar el servidor a escuchar en todas las interfaces en el puerto 5000
builder.WebHost.UseUrls("http://0.0.0.0:5000");

// Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

string connString = "Host=localhost;Port=5432;Database=meyerexpress_db;Username=ICINF;Password=ICINF";

// Endpoint de prueba explícito
app.MapGet("/api/health", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();
        return Results.Ok(new
        {
            status = "OK",
            mensaje = "Conectado a PostgreSQL exitosamente desde la Raspberry Pi"
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error de base de datos: {ex.Message}");
    }
});

app.Run();
