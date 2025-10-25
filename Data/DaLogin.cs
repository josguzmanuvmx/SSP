namespace SSP.Data
{
    public interface daLogin
    {
        bool ValidarCredenciales(string usuario, string contrasena);
    }

    public class UserService : daLogin
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool ValidarCredenciales(string usuario, string contrasena)
        {
            // Validación de las credenciales en la base de datos
            var usuarioEncontrado = _context.Usuarios
            .FirstOrDefault(u => u.SCuenta == usuario);
            // .FirstOrDefault(u => u.UserName == usuario && u.Contrasena == contrasena);

            return usuarioEncontrado != null;
        }
    }
}