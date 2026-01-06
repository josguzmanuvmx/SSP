namespace SSP.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using SSP.Models;

public class DaSolicitud
{
    private readonly ApplicationDbContext _context;

    public DaSolicitud(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene todos los empleados de la base de datos.
    /// </summary>
    public List<MoSolicitud> Obtener()
    {
        return _context.Solicitudes.ToList();
    }

    /// <summary>
    /// Obtiene un empleado específico por su ID.
    /// </summary>
    public MoSolicitud? ObtenerPorId(int nId)
    {
        return _context.Solicitudes.Find(nId);
    }

    /// <summary>
    /// Obtiene un empleado específico por su sUsuario.
    /// </summary>
    public MoSolicitud? ObtenerPorUsuario(string sUsuario)
    {
        return _context.Solicitudes.FirstOrDefault(e => e.SNomEmpl == sUsuario);
    }

    /// <summary>
    /// Agrega un nuevo empleado a la base de datos.
    /// </summary>
    public void Agregar(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null)
        {
            throw new ArgumentNullException(nameof(moSolicitud));
        }
        _context.Solicitudes.Add(moSolicitud);
        _context.SaveChanges();
    }

    /// <summary>
    /// Actualiza un empleado existente en la base de datos.
    /// </summary>
    public void Actualizar(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null)
        {
            throw new ArgumentNullException(nameof(moSolicitud));
        }

        // El método 'Update' le dice a EF Core que la entidad ha sido modificada
        _context.Solicitudes.Update(moSolicitud);
        _context.SaveChanges();
    }

    /// <summary>
    /// Elimina un empleado de la base de datos usando su ID.
    /// </summary>
    public void Eliminar(int nId)
    {
        // 1. Busca el empleado que se va a eliminar
        var empleado = _context.Solicitudes.Find(nId);

        // 2. Si existe, elimínalo
        if (empleado != null)
        {
            _context.Solicitudes.Remove(empleado);
            _context.SaveChanges();
        }
    }

    /// <summary>
    /// Verifica si ya existe un empleado con un 'sUsuario' específico.
    /// </summary>
    //public bool SolicitudExiste(string sId)
    //{
    //    if (string.IsNullOrEmpty(sId))
    //    {
    //        return false;
    //        Solicitudes
    //    return _context.Solicitudes.Any(e => e.SUsuario == sUsuario);
    //}

    /// <summary>
    /// Busca en la tabla 'Usuarios' por Nombre, Usuario o No. de Personal
    /// para el autocompletado del formulario de Empleados.
    /// </summary>
    public List<MoUsuario> BuscarUsuarios(string termino)
    {
        if (string.IsNullOrEmpty(termino))
        {
            return new List<MoUsuario>();
        }
        // 1. Prepara el término para un 'LIKE' de SQL (ej. "%angel%")
        var terminoLike = $"%{termino}%";

        // 2. Define la intercalación:
        //    CI = Case-Insensitive (ignora mayúsculas/minúsculas)
        //    AI = Accent-Insensitive (ignora acentos)
        var collation = "Latin1_General_CI_AI";

        var consulta = from u in _context.Usuarios
                       join e in _context.Empleados on u.SUsuario equals e.SUsuario into empJoin
                       from e in empJoin.DefaultIfEmpty()
                       where
                           // 2. ¡ESTA ES LA LÓGICA CORREGIDA!
                           //    Aplica la intercalación a la columna y LUEGO usa .Contains()
                           (u.SNombre != null && EF.Functions.Collate(u.SNombre, collation).Contains(termino)) ||
                           (u.SUsuario != null && EF.Functions.Collate(u.SUsuario, collation).Contains(termino)) ||

                           // La búsqueda por número no necesita intercalación
                           (e != null && e.NNoPersonal.ToString().Contains(termino))
                       select new MoUsuario
                       {
                           SNombre = u.SNombre,
                           SUsuario = u.SUsuario,
                           NNoPersonal = u.NNoPersonal
                       };

        return consulta.Take(10).ToList();
    }
}