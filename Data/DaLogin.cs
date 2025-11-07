using Microsoft.AspNetCore.Identity;

namespace SSP.Data
{
    public interface DaLogin
    {
        bool ValidarCredenciales(string usuario, string contrasena);
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

        public bool ValidarCredenciales(string usuario, string contrasena)
        {
            var usuarioEncontrado = _context.Usuarios
                .FirstOrDefault(u => u.SUsuario == usuario);

            if (usuarioEncontrado == null)
            {
                return false;
            }

            // 3. Usa el hasher inyectado con los argumentos correctos
            var resultado = _passwordHasher.VerifyHashedPassword(
                usuarioEncontrado,          // El objeto de usuario
                usuarioEncontrado.SContra,  // El hash de la base de datos
                contrasena                  // La contraseña que escribió el usuario
            );

            // 4. Compara el resultado
            return resultado == PasswordVerificationResult.Success;
        }
    }
}