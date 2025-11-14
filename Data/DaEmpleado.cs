namespace SiSProI.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SSP.Data;
using System.Data;
using SSP.Models;

public class DaEmpleado
{
    private readonly ApplicationDbContext _context;

    public DaEmpleado(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<MoEmpleado> Obtener()
    {
        return _context.Empleados.ToList();
    }

    public MoEmpleado? ObtenerPorId(int nId)
    {
        return _context.Empleados.Find(nId);
    }

    public MoEmpleado? ObtenerPorUsuario(string sUsuario)
    {
        return _context.Empleados.FirstOrDefault(e => e.SUsuario == sUsuario);
    }

    public List<MoUsuario> BuscarUsuarios(string termino)
    {
        if (string.IsNullOrEmpty(termino))
        {
            return new List<MoUsuario>();
        }
        var terminoBusqueda = termino.ToLower();

        // Busca en la tabla Usuarios (asumiendo que 'DaEmpleado' tiene acceso al DbContext)
        // Tu modelo MoUsuario tiene NNoPersonal, SUsuario y SNombre.
        return _context.Usuarios
            .Where(u =>
                (u.SNombre != null && u.SNombre.ToLower().Contains(terminoBusqueda)) ||
                (u.SUsuario != null && u.SUsuario.ToLower().Contains(terminoBusqueda)) ||
                (u.NNoPersonal.ToString().Contains(termino)) // Busca en el número
            )
            .Take(10) // Limita los resultados a 10 para un buen rendimiento
            .ToList();
    }

    public void Agregar(MoEmpleado moEmpleado)
    {
        if (moEmpleado == null)
        {
            throw new ArgumentNullException(nameof(moEmpleado));
        }
        _context.Empleados.Add(moEmpleado);
        _context.SaveChanges();
    }

    public void Actualizar(MoEmpleado moCatalogo)
    {
        if (moCatalogo == null)
        {
            throw new ArgumentNullException(nameof(moCatalogo));
        }
        _context.Empleados.Update(moCatalogo);
        _context.SaveChanges();
    }

    public void Eliminar(int nId)
    {
        var empleado = _context.Empleados.Find(nId);
        if (empleado != null)
        {
            _context.Empleados.Remove(empleado);
            _context.SaveChanges();
        }
    }

}