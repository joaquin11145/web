using Npgsql;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5000");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

string connString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=meyerexpress_db;Username=ICINF;Password=ICINF";

static string LimpiarRut(string rut) =>
    rut.Replace(".", "").Replace("-", "").Trim().ToUpper();

// Respeta VARCHAR(30) en Usuario.CONTRASENA sin alterar la BD
static string PrepararContrasenaParaDb(string password)
{
    var hash = BCrypt.Net.BCrypt.HashPassword(password);
    if (hash.Length <= 30) return hash;
    return password.Length <= 30 ? password : password[..30];
}

static DateTime? ParsearFechaNacimiento(string? fechaStr)
{
    if (string.IsNullOrWhiteSpace(fechaStr)) return null;
    if (DateTime.TryParse(fechaStr, out var dt)) return dt.Date;
    return null;
}

app.MapGet("/", () => Results.Redirect("/swagger"));

// ==========================================
// 0. HEALTH CHECK
// ==========================================
app.MapGet("/api/health", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();
        await using var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM usuario", conn);
        var total = Convert.ToInt32(await cmd.ExecuteScalarAsync());

        return Results.Ok(new
        {
            success = true,
            message = "Conectado a PostgreSQL exitosamente",
            data = new { totalUsuarios = total, fecha = DateTime.UtcNow }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error conectando a PostgreSQL: {ex.Message}");
    }
});

// ==========================================
// 1. READ ALL: Leer todos los usuarios
// GET /api/usuarios
// ==========================================
app.MapGet("/api/usuarios", async () =>
{
    try
    {
        var lista = new List<object>();
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        string query = "SELECT run, nombre, apellido, estadocuenta FROM usuario ORDER BY nombre ASC";
        await using var cmd = new NpgsqlCommand(query, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            string run = reader.GetString(0);
            string rutLimpio = LimpiarRut(run);
            string rol = rutLimpio == "999999999" ? "admin" : (rutLimpio == "222222222" ? "emprendedor" : "comprador");

            lista.Add(new
            {
                rut = run,
                nombre = reader.GetString(1),
                apellido = reader.GetString(2),
                nombreCompleto = $"{reader.GetString(1)} {reader.GetString(2)}",
                estadoCuenta = reader.IsDBNull(3) ? false : reader.GetBoolean(3),
                rol
            });
        }

        return Results.Ok(new
        {
            success = true,
            message = "Usuarios obtenidos correctamente.",
            data = lista
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al leer usuarios: {ex.Message}");
    }
});

// ==========================================
// 2. READ ONE: Leer un usuario por RUT
// GET /api/usuarios/{rut}
// ==========================================
app.MapGet("/api/usuarios/{rut}", async (string rut) =>
{
    string rutLimpio = LimpiarRut(rut);
    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        string query = "SELECT run, nombre, apellido, estadocuenta FROM usuario WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";
        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("rut", rutLimpio);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            return Results.NotFound(new { success = false, message = "Usuario no encontrado." });
        }

        return Results.Ok(new
        {
            success = true,
            message = "Usuario encontrado.",
            data = new
            {
                rut = reader.GetString(0),
                nombre = reader.GetString(1),
                apellido = reader.GetString(2),
                estadoCuenta = reader.IsDBNull(3) ? false : reader.GetBoolean(3)
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al buscar usuario: {ex.Message}");
    }
});

// ==========================================
// 3. CREATE: Crear usuario + opcionales (Correo, Teléfono, Dirección, Empresa)
// POST /api/usuarios
// ==========================================
app.MapPost("/api/usuarios", async (UsuarioCreateDto dto) =>
{
    var errores = new List<string>();
    if (string.IsNullOrWhiteSpace(dto.Rut)) errores.Add("El RUT es obligatorio.");
    if (string.IsNullOrWhiteSpace(dto.Nombre)) errores.Add("El nombre es obligatorio.");
    if (string.IsNullOrWhiteSpace(dto.Apellido)) errores.Add("El apellido es obligatorio.");
    if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 3)
        errores.Add("La contraseña debe tener al menos 3 caracteres.");
    if (dto.SoyEmpresa && string.IsNullOrWhiteSpace(dto.NombreEmpresa))
        errores.Add("El nombre de la empresa es obligatorio si soyEmpresa es true.");

    if (errores.Count > 0)
    {
        return Results.BadRequest(new { success = false, message = "Datos inválidos.", errors = errores });
    }

    string rutLimpio = LimpiarRut(dto.Rut);
    string rutGuardado = dto.Rut.Trim();
    string nombreGuardado = dto.Nombre.Trim();
    string apellidoGuardado = dto.Apellido.Trim();
    string passParaDb = PrepararContrasenaParaDb(dto.Password);
    DateTime? fechaNac = ParsearFechaNacimiento(dto.FechaNacimiento);

    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        // Validar duplicado en Usuario
        string checkQuery = "SELECT COUNT(*) FROM usuario WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";
        await using var checkCmd = new NpgsqlCommand(checkQuery, conn);
        checkCmd.Parameters.AddWithValue("rut", rutLimpio);
        if (Convert.ToInt32(await checkCmd.ExecuteScalarAsync()) > 0)
        {
            return Results.Conflict(new
            {
                success = false,
                message = "El RUT ya está registrado.",
                errors = new[] { "rut: ya existe un usuario con ese RUT." }
            });
        }

        await using var tx = await conn.BeginTransactionAsync();

        // 1. Insertar en Usuario
        string insertUsuario = @"
            INSERT INTO usuario (
                run, nombre, apellido, sexo, contrasena, estadocuenta,
                fechanacimiento, puntosacumulacion, fecharegistro, descuentoporcentaje
            )
            VALUES (
                @run, @nombre, @apellido, @sexo, @contrasena, @estadocuenta,
                @fechanacimiento, 0, CURRENT_DATE, 0
            )";

        await using var cmdUser = new NpgsqlCommand(insertUsuario, conn, tx);
        cmdUser.Parameters.AddWithValue("run", rutGuardado);
        cmdUser.Parameters.AddWithValue("nombre", nombreGuardado);
        cmdUser.Parameters.AddWithValue("apellido", apellidoGuardado);
        cmdUser.Parameters.AddWithValue("sexo", (object?)dto.Sexo?.Trim() ?? DBNull.Value);
        cmdUser.Parameters.AddWithValue("contrasena", passParaDb);
        cmdUser.Parameters.AddWithValue("estadocuenta", dto.EstadoCuenta);
        cmdUser.Parameters.AddWithValue("fechanacimiento", (object?)fechaNac ?? DBNull.Value);
        await cmdUser.ExecuteNonQueryAsync();

        // 2. Opcional: Correo + PoseeCorreo
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            string correoId = $"C-{Guid.NewGuid().ToString("N")[..12]}";
            string insertCorreo = @"
                INSERT INTO correo (id, direccion, tipo, estado, verificado, fecharegistro, permitenotificaciones)
                VALUES (@id, @direccion, 'personal', true, false, CURRENT_DATE, true)";
            await using var cmdCorreo = new NpgsqlCommand(insertCorreo, conn, tx);
            cmdCorreo.Parameters.AddWithValue("id", correoId);
            cmdCorreo.Parameters.AddWithValue("direccion", dto.Email.Trim());
            await cmdCorreo.ExecuteNonQueryAsync();

            string insertPoseeCorreo = "INSERT INTO poseecorreo (usuario_run, correo_id) VALUES (@run, @correoId)";
            await using var cmdPoseeCorreo = new NpgsqlCommand(insertPoseeCorreo, conn, tx);
            cmdPoseeCorreo.Parameters.AddWithValue("run", rutGuardado);
            cmdPoseeCorreo.Parameters.AddWithValue("correoId", correoId);
            await cmdPoseeCorreo.ExecuteNonQueryAsync();
        }

        // 3. Opcional: Teléfonos + PoseeTelefono
        if (dto.Telefonos is { Count: > 0 })
        {
            int idx = 1;
            foreach (var tel in dto.Telefonos)
            {
                string soloDigitos = new string((tel.Numero ?? "").Where(char.IsDigit).ToArray());
                if (soloDigitos.Length < 8) continue;
                if (soloDigitos.Length > 15) soloDigitos = soloDigitos[^15..];

                string codigoTel = $"T-{rutLimpio}-{idx}-{Guid.NewGuid().ToString("N")[..5]}";
                if (codigoTel.Length > 20) codigoTel = codigoTel[..20];

                string insertTel = "INSERT INTO telefono (codigo, numero, tipo) VALUES (@codigo, @numero, @tipo)";
                await using var cmdTel = new NpgsqlCommand(insertTel, conn, tx);
                cmdTel.Parameters.AddWithValue("codigo", codigoTel);
                cmdTel.Parameters.AddWithValue("numero", soloDigitos);
                cmdTel.Parameters.AddWithValue("tipo", string.IsNullOrWhiteSpace(tel.Tipo) ? "movil" : tel.Tipo.Trim());
                await cmdTel.ExecuteNonQueryAsync();

                string insertPoseeTel = "INSERT INTO poseetelefono (usuario_run, telefono_codigo) VALUES (@run, @codigo)";
                await using var cmdPoseeTel = new NpgsqlCommand(insertPoseeTel, conn, tx);
                cmdPoseeTel.Parameters.AddWithValue("run", rutGuardado);
                cmdPoseeTel.Parameters.AddWithValue("codigo", codigoTel);
                await cmdPoseeTel.ExecuteNonQueryAsync();
                idx++;
            }
        }

        // 4. Opcional: Direcciones + PoseeDireccion (solo si existe la comuna)
        if (dto.Direcciones is { Count: > 0 })
        {
            foreach (var dir in dto.Direcciones)
            {
                if (string.IsNullOrWhiteSpace(dir.Calle) || string.IsNullOrWhiteSpace(dir.Numero) || dir.IdComuna <= 0)
                    continue;

                string checkComuna = "SELECT COUNT(*) FROM comuna WHERE id = @idComuna";
                await using var cmdComuna = new NpgsqlCommand(checkComuna, conn, tx);
                cmdComuna.Parameters.AddWithValue("idComuna", dir.IdComuna);
                if (Convert.ToInt32(await cmdComuna.ExecuteScalarAsync()) == 0)
                    continue;

                string cp = string.IsNullOrWhiteSpace(dir.CodigoPostal)
                    ? $"CP-{Guid.NewGuid().ToString("N")[..10]}"
                    : dir.CodigoPostal.Trim();
                if (cp.Length > 20) cp = cp[..20];

                string insertDir = @"
                    INSERT INTO direccion (codigopostal, calle, numero, id_comuna)
                    VALUES (@cp, @calle, @numero, @idComuna)
                    ON CONFLICT (codigopostal) DO NOTHING";
                await using var cmdDir = new NpgsqlCommand(insertDir, conn, tx);
                cmdDir.Parameters.AddWithValue("cp", cp);
                cmdDir.Parameters.AddWithValue("calle", dir.Calle.Trim());
                cmdDir.Parameters.AddWithValue("numero", dir.Numero.Trim());
                cmdDir.Parameters.AddWithValue("idComuna", dir.IdComuna);
                await cmdDir.ExecuteNonQueryAsync();

                string insertPoseeDir = @"
                    INSERT INTO poseedireccion (usuario_run, direccion_codigopostal)
                    VALUES (@run, @cp)
                    ON CONFLICT DO NOTHING";
                await using var cmdPoseeDir = new NpgsqlCommand(insertPoseeDir, conn, tx);
                cmdPoseeDir.Parameters.AddWithValue("run", rutGuardado);
                cmdPoseeDir.Parameters.AddWithValue("cp", cp);
                await cmdPoseeDir.ExecuteNonQueryAsync();
            }
        }

        // 5. Opcional: Empresa + UsuarioEmpresa (si soyEmpresa == true)
        if (dto.SoyEmpresa && !string.IsNullOrWhiteSpace(dto.NombreEmpresa))
        {
            string runEmpresa = string.IsNullOrWhiteSpace(dto.RutEmpresa) ? rutGuardado : dto.RutEmpresa.Trim();
            string insertEmpresa = @"
                INSERT INTO empresa (run, nombre, paginaweb)
                VALUES (@runEmp, @nombreEmp, @web)
                ON CONFLICT (run) DO UPDATE SET nombre = EXCLUDED.nombre, paginaweb = EXCLUDED.paginaweb";
            await using var cmdEmp = new NpgsqlCommand(insertEmpresa, conn, tx);
            cmdEmp.Parameters.AddWithValue("runEmp", runEmpresa);
            cmdEmp.Parameters.AddWithValue("nombreEmp", dto.NombreEmpresa.Trim());
            cmdEmp.Parameters.AddWithValue("web", (object?)dto.PaginaWeb?.Trim() ?? DBNull.Value);
            await cmdEmp.ExecuteNonQueryAsync();

            string insertUserEmp = @"
                INSERT INTO usuarioempresa (usuario_run, empresa_run)
                VALUES (@runUser, @runEmp)
                ON CONFLICT DO NOTHING";
            await using var cmdUserEmp = new NpgsqlCommand(insertUserEmp, conn, tx);
            cmdUserEmp.Parameters.AddWithValue("runUser", rutGuardado);
            cmdUserEmp.Parameters.AddWithValue("runEmp", runEmpresa);
            await cmdUserEmp.ExecuteNonQueryAsync();
        }

        await tx.CommitAsync();

        return Results.Created($"/api/usuarios/{rutGuardado}", new
        {
            success = true,
            message = "Usuario creado exitosamente.",
            data = new
            {
                rut = rutGuardado,
                nombre = nombreGuardado,
                apellido = apellidoGuardado,
                email = dto.Email,
                soyEmpresa = dto.SoyEmpresa,
                nombreEmpresa = dto.SoyEmpresa ? dto.NombreEmpresa : null,
                estadoCuenta = dto.EstadoCuenta
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear usuario: {ex.Message}");
    }
});

// ==========================================
// 4. UPDATE: Actualizar un usuario por RUT
// PUT /api/usuarios/{rut}
// ==========================================
app.MapPut("/api/usuarios/{rut}", async (string rut, UsuarioUpdateDto dto) =>
{
    var errores = new List<string>();
    if (string.IsNullOrWhiteSpace(dto.Nombre)) errores.Add("El nombre es obligatorio.");
    if (string.IsNullOrWhiteSpace(dto.Apellido)) errores.Add("El apellido es obligatorio.");
    if (!string.IsNullOrWhiteSpace(dto.Password) && dto.Password.Length < 3)
        errores.Add("Si actualiza la contraseña, debe tener al menos 3 caracteres.");

    if (errores.Count > 0)
    {
        return Results.BadRequest(new { success = false, message = "Datos inválidos.", errors = errores });
    }

    string rutLimpio = LimpiarRut(rut);

    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        bool cambiarPass = !string.IsNullOrWhiteSpace(dto.Password);
        string updateQuery = cambiarPass
            ? @"UPDATE usuario SET nombre = @nombre, apellido = @apellido, contrasena = @contrasena, estadocuenta = @estadocuenta
                WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut"
            : @"UPDATE usuario SET nombre = @nombre, apellido = @apellido, estadocuenta = @estadocuenta
                WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";

        await using var cmd = new NpgsqlCommand(updateQuery, conn);
        cmd.Parameters.AddWithValue("nombre", dto.Nombre.Trim());
        cmd.Parameters.AddWithValue("apellido", dto.Apellido.Trim());
        cmd.Parameters.AddWithValue("estadocuenta", dto.EstadoCuenta);
        cmd.Parameters.AddWithValue("rut", rutLimpio);

        if (cambiarPass)
        {
            cmd.Parameters.AddWithValue("contrasena", PrepararContrasenaParaDb(dto.Password!));
        }

        int filasAfectadas = await cmd.ExecuteNonQueryAsync();
        if (filasAfectadas == 0)
        {
            return Results.NotFound(new { success = false, message = "Usuario no encontrado para actualizar." });
        }

        return Results.Ok(new
        {
            success = true,
            message = "Usuario actualizado correctamente.",
            data = new
            {
                rut = rut.Trim(),
                nombre = dto.Nombre.Trim(),
                apellido = dto.Apellido.Trim(),
                estadoCuenta = dto.EstadoCuenta
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al actualizar usuario: {ex.Message}");
    }
});

// ==========================================
// 5. DELETE: Eliminar un usuario por RUT
// DELETE /api/usuarios/{rut}
// ==========================================
app.MapDelete("/api/usuarios/{rut}", async (string rut) =>
{
    string rutLimpio = LimpiarRut(rut);

    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        string deleteQuery = "DELETE FROM usuario WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";
        await using var cmd = new NpgsqlCommand(deleteQuery, conn);
        cmd.Parameters.AddWithValue("rut", rutLimpio);

        int filasAfectadas = await cmd.ExecuteNonQueryAsync();
        if (filasAfectadas == 0)
        {
            return Results.NotFound(new { success = false, message = "Usuario no encontrado para eliminar." });
        }

        return Results.Ok(new
        {
            success = true,
            message = "Usuario eliminado correctamente."
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar usuario (puede tener registros asociados): {ex.Message}");
    }
});

// ==========================================
// 6. AUTH LOGIN
// POST /api/auth/login
// ==========================================
app.MapPost("/api/auth/login", async (LoginRequest req) =>
{
    string rutLimpio = LimpiarRut(req.Rut);

    try
    {
        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        string query = "SELECT run, nombre, apellido, contrasena, estadocuenta FROM usuario WHERE REPLACE(REPLACE(run, '.', ''), '-', '') = @rut";
        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("rut", rutLimpio);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            string dbRun = reader.GetString(0);
            string dbNombre = reader.GetString(1) + " " + reader.GetString(2);
            string dbPass = reader.GetString(3);

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

public record TelefonoInput(string Numero, string? Tipo = "movil");

public record DireccionInput(
    string Calle,
    string Numero,
    int IdComuna,
    string? CodigoPostal = null
);

public record UsuarioCreateDto(
    string Rut,
    string Nombre,
    string Apellido,
    string Password,
    string? Email = null,
    string? Sexo = null,
    string? FechaNacimiento = null,
    bool EstadoCuenta = true,
    bool SoyEmpresa = false,
    string? NombreEmpresa = null,
    string? RutEmpresa = null,
    string? PaginaWeb = null,
    List<TelefonoInput>? Telefonos = null,
    List<DireccionInput>? Direcciones = null
);

public record UsuarioUpdateDto(
    string Nombre,
    string Apellido,
    string? Password,
    bool EstadoCuenta = true
);
