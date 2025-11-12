using Microsoft.EntityFrameworkCore;

namespace SSP.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<MoUsuario> Usuarios { get; set; }
        public DbSet<MoRol> Roles { get; set; }
        public DbSet<MoUsuarioRol> UsuarioRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define la llave compuesta (nUsrId, nRolId) para la tabla UsuarioRoles
            modelBuilder.Entity<MoUsuarioRol>()
                .HasKey(ur => new { ur.NUsrId, ur.NRolId });
        }
    }
}