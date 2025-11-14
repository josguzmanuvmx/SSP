using Microsoft.EntityFrameworkCore;
using SSP.Models;

namespace SSP.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<MoUsuario> Usuarios { get; set; }
        public DbSet<MoEmpleado> Empleados { get; set; }
    }
}