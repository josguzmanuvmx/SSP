using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace SSP.Data
{
    public interface DaLogin
    {
        bool ValidarCredenciales(string sUsuario, string sContrasena);
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

        public bool ValidarCredenciales(string usuario, string contrasena)
        {
            var usuarioEncontrado = _context.Usuarios
                .FirstOrDefault(u => u.SUsuario == usuario);

            if (usuarioEncontrado == null || string.IsNullOrEmpty(usuarioEncontrado.SContra))
            {
                return false;
            }

            var resultado = _passwordHasher.VerifyHashedPassword(
                usuarioEncontrado,
                usuarioEncontrado.SContra!,
                contrasena
            );

            return resultado == PasswordVerificationResult.Success;
        }

        public List<string> ObtenerRoles(string sUsuario)
        {
            var roles = from u in _context.Usuarios
                        join ur in _context.UsuarioRoles on u.NId equals ur.NUsrId
                        join r in _context.Roles on ur.NRolId equals r.NId
                        where u.SUsuario == "josguzman"
                        select r.SRol;

            return roles.ToList();
        }
    }
}