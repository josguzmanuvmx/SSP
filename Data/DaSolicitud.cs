namespace SSP.Data;
using Microsoft.EntityFrameworkCore;
using SSP.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class DaSolicitud
{
    private readonly ApplicationDbContext _context;

    public DaSolicitud(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene todas las solicitudes ordenadas por fecha (las más recientes primero).
    /// </summary>
    public List<MoSolicitud> Obtener()
    {
        // Es mejor devolver una lista concreta para evitar problemas de conexión abierta
        return _context.Solicitudes
                       .OrderByDescending(x => x.DtFecCre)
                       .ToList();
    }

    /// <summary>
    /// Versión Asíncrona de Obtener (Recomendada).
    /// </summary>
    public async Task<List<MoSolicitud>> ObtenerAsync()
    {
        return await _context.Solicitudes
                             .OrderByDescending(x => x.DtFecCre)
                             .ToListAsync();
    }

    /// <summary>
    /// Obtiene una solicitud específica por su ID.
    /// </summary>
    public MoSolicitud? ObtenerPorId(int nId)
    {
        return _context.Solicitudes.Find(nId);
    }

    /// <summary>
    /// Agrega una nueva solicitud a la base de datos.
    /// </summary>
    public void Agregar(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null) throw new ArgumentNullException(nameof(moSolicitud));
        
        _context.Solicitudes.Add(moSolicitud);
        _context.SaveChanges();
    }

    // Versión Asíncrona (Recomendada)
    public async Task AgregarAsync(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null) throw new ArgumentNullException(nameof(moSolicitud));

        await _context.Solicitudes.AddAsync(moSolicitud);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Actualiza una solicitud existente.
    /// </summary>
    public void Actualizar(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null) throw new ArgumentNullException(nameof(moSolicitud));

        // Verificamos si la entidad está rastreada (attached) para evitar conflictos
        // Si usas AsNoTracking en la lectura, esto no es necesario, pero es seguridad.
        _context.Solicitudes.Update(moSolicitud);
        _context.SaveChanges();
    }

    // Versión Asíncrona
    public async Task ActualizarAsync(MoSolicitud moSolicitud)
    {
        if (moSolicitud == null) throw new ArgumentNullException(nameof(moSolicitud));

        _context.Solicitudes.Update(moSolicitud);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Elimina (físicamente) una solicitud por ID.
    /// </summary>
    public void Eliminar(int nId)
    {
        var solicitud = _context.Solicitudes.Find(nId);
        if (solicitud != null)
        {
            _context.Solicitudes.Remove(solicitud);
            _context.SaveChanges();
        }
    }

    /// <summary>
    /// Elimina lógicamente (cambia estado a inactivo/cancelado).
    /// Esto es más seguro que borrar el registro.
    /// </summary>
    public async Task CancelarSolicitudAsync(int nId)
    {
        var solicitud = await _context.Solicitudes.FindAsync(nId);
        if (solicitud != null)
        {
            solicitud.BActivo = false; // O usa un Estado de 'Cancelado'
            solicitud.DtUltAct = DateTime.Now;
            await _context.SaveChangesAsync();
        }
    }

    // --- BÚSQUEDA DE USUARIOS (AUTOCOMPLETE) ---
    // Esta parte la dejé casi igual porque tu lógica de Join e Intercalación es buena.
    public List<MoUsuario> BuscarUsuarios(string termino)
    {
        if (string.IsNullOrEmpty(termino)) return new List<MoUsuario>();

        var terminoLike = $"%{termino}%";
        var collation = "Latin1_General_CI_AI"; 

        var consulta = from u in _context.Usuarios
                       join e in _context.Empleados on u.SUsuario equals e.SUsuario into empJoin
                       from e in empJoin.DefaultIfEmpty()
                       where
                           (u.SNombre != null && EF.Functions.Collate(u.SNombre, collation).Contains(termino)) ||
                           (u.SUsuario != null && EF.Functions.Collate(u.SUsuario, collation).Contains(termino)) ||
                           (e != null && e.NNoPersonal.ToString().Contains(termino))
                       select new MoUsuario
                       {
                           SNombre = u.SNombre,
                           SUsuario = u.SUsuario,
                           NNoPersonal = u.NNoPersonal,
                           // Agregamos datos extra útiles para el autocompletado si los tienes
                           // SCorreo = u.SCorreo, 
                           // NClaveRegion = ...
                       };

        return consulta.Take(10).ToList();
    }
}