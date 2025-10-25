using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SSP.Models;
using SSP.ViewModels;

namespace SSP.Data
{
    public class ApplicationDbContext : IdentityDbContext<MoUsuario>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}