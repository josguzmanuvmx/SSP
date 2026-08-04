namespace Solicitud.Controllers;
using SSP.Data;
using SSP.Models;
using SSP.Functions;
using SSP.ViewModels;
using Solicitud.Models;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize(Policy = "ModulosPolicy")]
public class InicioController : Controller
{
    private readonly ILogger<InicioController> _logger;

    private readonly DaSolicitud _daSolicitud;
    private readonly ClsEncrypt _encrypt;

    public InicioController(ILogger<InicioController> logger, DaSolicitud daSolicitud, IConfiguration config)
    {
        _logger = logger;
        _daSolicitud = daSolicitud;
        _encrypt = new ClsEncrypt(config);
    }

    public IActionResult Index()
    {
        // 1. Obtener la lista cruda de la base de datos
        List<MoSolicitud> lsMoSolicitud = _daSolicitud.Obtener();

        // 2. Mapeo Manual (DB Entity -> ViewModel)
        // Usamos .Select() para proyectar cada elemento
        List<VmSolicitud> lsVmSolicitud = lsMoSolicitud.Select(dbItem => new VmSolicitud
        {
            // Convertimos el ID numérico a string (o a Hash si usas encriptación)
            // En tu Controller Index()
            SId = Uri.EscapeDataString(_encrypt.FnsEncripta(dbItem.NId.ToString())?.SEncript ?? ""),

            SFolio = dbItem.SFolio,

            // Mapeo directo de propiedades simples
            SNomEmpl = dbItem.SNomEmpl,
            NNoPer = dbItem.NNoPer,
            SUsuario = dbItem.SUsuario,
            SCorreo = dbItem.SCorreo,

            // Datos de la dependencia
            NUResClv = dbItem.NUResClv,
            // Como la tabla solo tiene la Clave, ponemos la clave en el Nombre 
            // (O aquí harías una búsqueda en tu catálogo de dependencias)
            SUResNom = dbItem.NUResClv.ToString(),

            // Estatus y Fechas
            Estado = dbItem.Estado,
            DtFecCre = dbItem.DtFecCre,

            // No es necesario deserializar los JSON (dcFina, dcEstu) para el listado principal
            // Esto hace que la carga sea mucho más rápida.
        }).OrderByDescending(x => x.DtFecCre).ToList();

        // 3. Mandamos la lista ya convertida a la vista
        return View(lsVmSolicitud);
    }

    [HttpPost]
    public IActionResult Eliminar(string sId)
    {
        try
        {
            // 1. Validar que llegue algo
            if (string.IsNullOrEmpty(sId))
            {
                return Json(new { success = false, message = "No se recibió el identificador." });
            }

            // 2. INTENTAR DESENCRIPTAR
            // Tu clase ClsEncrypt lanza una excepción si el string no es Base64 válido
            // o si la contraseña no coincide, por eso usamos un try interno.
            string idLimpio = Uri.UnescapeDataString(sId);
            var idDesencriptado = "";
            try
            {
                idDesencriptado = _encrypt.FnsDesEncripta(idLimpio);
            }
            catch (Exception)
            {
                // Esto ocurre si el usuario modificó el ID "a mano" en el HTML
                return Json(new { success = false, message = "Error de seguridad: El identificador es inválido." });
            }

            // 3. Convertir a Entero
            if (string.IsNullOrEmpty(idDesencriptado) || !int.TryParse(idDesencriptado, out int nId))
            {
                return Json(new { success = false, message = "El identificador no contiene un formato numérico válido." });
            }

            // 4. Llamar a la Base de Datos
            // Aquí usamos tu método Eliminar de DaSolicitud
            _daSolicitud.Eliminar(nId);

            return Json(new { success = true, message = "La solicitud ha sido eliminada correctamente." });
        }
        catch (Exception ex)
        {
            // Errores de BD o generales
            return Json(new { success = false, message = "Ocurrió un error al intentar eliminar: " + ex.Message });
        }
    }
}