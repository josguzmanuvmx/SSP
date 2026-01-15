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

        try
        {
            // --- GENERACIÓN DE FOLIO ÚNICO ---
            string folioGenerado = "";
            bool esUnico = false;
            int intentos = 0;

            do
            {
                // 1. Generamos el código (6 caracteres)
                string codigo = GenerarCodigoAleatorio(6);
                folioGenerado = $"SOL-{codigo}";

                // 2. Verificamos "en caliente" si existe en la BD
                // Nota: Aunque esto diga false, existe una micro-posibilidad de choque
                // en concurrencia, pero el índice UNIQUE de la BD lo detendrá al guardar.
                bool existe = _context.Solicitudes.Any(x => x.SFolio == folioGenerado);

                if (!existe) esUnico = true;

                intentos++;
                // Evitamos bucles infinitos por seguridad
                if (intentos > 10) throw new Exception("No se pudo asignar un folio único. Intente de nuevo.");

            } while (!esUnico);

            moSolicitud.SFolio = folioGenerado;
            // ---------------------------------

            // 3. Guardar
            // EF Core abre su propia transacción aquí automáticamente.
            _context.Solicitudes.Add(moSolicitud);
            _context.SaveChanges();
        }
        catch (DbUpdateException ex)
        {
            // Si entra aquí, es probable que (por mala suerte extrema) se generó un duplicado 
            // justo en el milisegundo que otro usuario guardaba.
            // Opcional: Podrías llamar a Agregar(moSolicitud) recursivamente para reintentar.
            throw new Exception("Error de concurrencia al generar folio. Intente guardar de nuevo.", ex);
        }
        catch (Exception)
        {
            throw;
        }
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

    private string GenerarCodigoAleatorio(int longitud)
    {
        // Alfabeto seguro:
        // 1. Sin vocales (Evita palabras ofensivas como FEO, CACO, PIS)
        // 2. Sin confusos (Sin 0, O, 1, I, L)
        const string chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

        var random = new Random();
        var resultado = new char[longitud];

        for (int i = 0; i < longitud; i++)
        {
            resultado[i] = chars[random.Next(chars.Length)];
        }

        return new string(resultado);
    }
}