using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace SSP.Data
{
    public interface DaLogin
    {
        MoUsuario? ValidarCredenciales(string usuario, string contrasena);
        List<string> ObtenerRoles(string sUsuario);
    }

    public class UserService : DaLogin
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<MoUsuario> _passwordHasher;

        public UserService(ApplicationDbContext context, IPasswordHasher<MoUsuario> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public MoUsuario? ValidarCredenciales(string usuario, string contrasena)
        {
            var usuarioEncontrado = _context.Usuarios
                .FirstOrDefault(u => u.SUsuario == usuario);

            if (usuarioEncontrado == null || string.IsNullOrEmpty(usuarioEncontrado.SContra))
            {
                return null; // Usuario no encontrado o sin contraseña
            }

            var resultado = _passwordHasher.VerifyHashedPassword(
                usuarioEncontrado,
                usuarioEncontrado.SContra,
                contrasena
            );

            // Si la contraseña es correcta, devuelve el objeto de usuario completo
            if (resultado == PasswordVerificationResult.Success)
            {
                return usuarioEncontrado;
            }

            return null; // Contraseña incorrecta
        }

        public List<string> ObtenerRoles(string sUsuario)
        {
            // 1. Escribe la consulta SQL exacta que te funcionó en la base de datos.
            //    ¡Usa @sUsuario para prevenir Inyección SQL!
            var sql = @"
                SELECT r.sRol
                FROM dbo.Usuarios AS u
                JOIN dbo.UsuarioRoles AS ur ON u.nId = ur.nUsrId
                JOIN dbo.Roles AS r ON ur.NRolId = r.nId
                WHERE u.sUsuario = @sUsuario";

            // 2. Crea el parámetro para la consulta
            var parametroUsuario = new SqlParameter("@sUsuario", sUsuario);

            // 3. Ejecuta la consulta
            //    Usamos _context.Roles.FromSqlRaw(...) porque el resultado (r.sRol)
            //    es una columna de la tabla Roles.
            //    Necesitamos un DbSet para anclar la consulta.

            //    ¡OJO! Esta es una forma un poco "tramposa" de obtener solo los strings.
            //    EF quiere mapear a un modelo. Vamos a hacerlo más simple:
            //    _context.Database.SqlQueryRaw<string> es mejor.

            // --- Versión Corregida y Más Simple ---
            try
            {
                var roles = _context.Database
                    .SqlQueryRaw<string>(sql, parametroUsuario)
                    .ToList();

                return roles;
            }
            catch (System.Exception ex)
            {
                // Si esto falla, el error (ex) nos dirá exactamente por qué.
                // (ej. "Invalid column name 'nUsrId'", "Invalid object name 'dbo.Roles'")
                Console.WriteLine(ex.ToString());
                return new List<string>(); // Devuelve lista vacía en caso de error
            }
        }
    }
}