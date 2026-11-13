using Npgsql;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Escuchar en todas las interfaces de red en el puerto 5000
builder.WebHost.UseUrls("http://0.0.0.0:5000");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Habilitar CORS para permitir peticiones desde tu PC (Frontend React)
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
app.UseSwagger();
app.UseSwaggerUI();

string connString = builder.Configuration.GetConnectionString("DefaultConnection")!;

// 1. Endpoint de verificación de salud y conexión a PostgreSQL
app.MapGet("/api/health", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();
        return Results.Ok(new
        {
            status = "OK",
            servidor = "Raspberry Pi .NET 8 API",
            baseDatos = "PostgreSQL Conectada y Operativa",
            fecha = DateTime.Now
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error conectando a PostgreSQL: {ex.Message}");
    }
});

// 2. Endpoint de Autenticación (Login) consultando la tabla Usuario o respaldos
app.MapPost("/api/auth/login", async (LoginRequest req) =>
{
    string rutLimpio = req.Rut.Replace(".", "").Replace("-", "").Trim().ToUpper();

    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        // Consultar el usuario directamente en la base de datos PostgreSQL
        string query = "SELECT run, nombre, apellido, contrasena, estadocuenta FROM usuario WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";
        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("rut", rutLimpio);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            string dbRun = reader.GetString(0);
            string dbNombre = reader.GetString(1) + " " + reader.GetString(2);
            string dbPass = reader.GetString(3);
            bool estadoCuenta = reader.GetBoolean(4);

            // Validar clave (si está en texto plano o cifrada)
            bool passValida = req.Password == dbPass || (dbPass.StartsWith("$2") && BCrypt.Net.BCrypt.Verify(req.Password, dbPass));

            if (passValida)
            {
                string rol = rutLimpio == "999999999" ? "admin" : (rutLimpio == "222222222" ? "emprendedor" : "comprador");
                return Results.Ok(new
                {
                    success = true,
                    user = new
                    {
                        rut = dbRun,
                        name = dbNombre,
                        email = $"{rutLimpio.ToLower()}@meyerexpress.cl",
                        rol = rol,
                        soyEmpresa = rol == "emprendedor"
                    }
                });
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error en login DB: {ex.Message}");
    }

    return Results.Unauthorized();
});

app.Run();

public record LoginRequest(string Rut, string Password, bool Recuerdame = true);
