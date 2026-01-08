using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.Extensions;
using SSP.Functions;
using SSP.Models;
using SSP.ViewModels;
using System.IO.Compression;

[Authorize(Policy = "ModulosPolicy")]
public class SolicitudController : Controller
{
    private readonly DaEmpleado _daEmpleado;
    private readonly DaSolicitud _daSolicitud;
    private readonly ClsEncrypt _encrypt;
    private readonly ClsGenerarSolicitud _generador;

    public SolicitudController(DaEmpleado daEmpleado, DaSolicitud daSolicitud, IConfiguration config, ClsGenerarSolicitud generador)
    {
        _daEmpleado = daEmpleado;
        _daSolicitud = daSolicitud;
        _encrypt = new ClsEncrypt(config);
        _generador = generador;
    }

    [HttpGet]
    public IActionResult Index()
    {
        var vmSolicitud = new VmSolicitud();
        return View(new VmSolicitud());
    }

    [HttpGet]
    public IActionResult Agregar()
    {
        //var vmSolicitudAct = new VmSolicitudAct
        //{
        //    vmSolicitud = new VmSolicitud(),
        //    lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
        //                    .Cast<ClsSprfmActividades>()
        //                    .Select(a => new ClslActividades
        //                    {
        //                        SNombre = a.GetDisplayName(),
        //                        SDescripcion = a.GetDescription()
        //                    })
        //                    .ToList()
        //};
        return View("Index", new VmSolicitud());
    }

    [HttpGet]
    public IActionResult Editar(string sId)
    {
        //var vmSolicitudAct = new VmSolicitudAct
        //{
        //    vmSolicitud = new VmSolicitud(),
        //    lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
        //                    .Cast<ClsSprfmActividades>()
        //                    .Select(a => new ClslActividades
        //                    {
        //                        SNombre = a.GetDisplayName(),
        //                        SDescripcion = a.GetDescription()
        //                    })
        //                    .ToList()
        //};
        return View("Index", new VmSolicitud());
    }


    [HttpPost]
    public async Task<IActionResult> GuardarBorrador(VmSolicitud modeloRecibido)
    {
        //try
        //{
        //    // Accedemos a los datos
        //    var datos = modeloRecibido.vmSprfm;

        //    // Mapeamos a la entidad (Aquí usa tu lógica de mapeo habitual)
        //    var solicitud = new MoSolicitud
        //    {
        //        // Datos básicos (incluso si son nulos, permitimos guardarlos como borrador)
        //        NombreEmpleado = datos.SNombreEmpleado,
        //        UnidadResponsableClave = datos.NUnidadResponsableClave,
        //        // ... resto de campos ...

        //        // IMPORTANTE: Marcamos el estado
        //        Estado = "Borrador",
        //        FechaSolicitud = DateTime.Now
        //    };

        //    // Guardamos en BD
        //    _context.Solicitudes.Add(solicitud);
        //    await _context.SaveChangesAsync();

        //    return Json(new { success = true, message = "Borrador guardado correctamente." });
        //}
        //catch (Exception ex)
        //{
        //    return Json(new { success = false, message = "Error al guardar borrador: " + ex.Message });
        //}
        return Json(new { success = true, message = "Borrador guardado correctamente." });
    }

    //public IActionResult Index()
    //{
    //    var modelo = new VmSprfmAct
    //    {
    //        // Inicializamos el formulario vacío
    //        vmSprfm = new VmSoliSprfm(),

    //        // 2. ¡AQUÍ ESTÁ LA MAGIA!
    //        // Convertimos el Enum en una lista de objetos para la vista
    //        lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
    //                        .Cast<ClsSprfmActividades>()
    //                        .Select(a => new ItemActividad
    //                        {
    //                            SNombre = a.GetDisplayName(),
    //                            SDescripcion = a.GetDescription() // Aquí recuperamos el HTML de la lista
    //                        })
    //                        .ToList()
    //    };

    //    return View(modelo);
    //}

    [HttpGet]
    public IActionResult BuscarUsuarios(string sUsuario)
    {
        // Llama al nuevo método en tu servicio
        var lsUsuarios = _daEmpleado.BuscarUsuarios(sUsuario);

        // Formatea los datos para que el autocompletado los entienda
        var resultados = lsUsuarios.Select(u => new
        {
            // El texto a mostrar, ej: "Ángel Guzmán (angel) - 12345"
            label = $"[{u.NNoPersonal}] {u.SUsuario} - {u.SNombre}",

            // Los datos que usaremos para rellenar el formulario
            sNomEmpl = "José Ángel Guzmán Zavaleta",
            nNoPer = 61399,
            nUsrClv = 65478,
            sCorreo = "josguzman@uv.mx",
            nUResClv = 1,
            sUResNom = "USII",
            nRegClv = 1,
            Region = (int)Region.SXal,
            sPueEmpl = "Becario"

            //sNomEmpl = u.sNomEmpl,
            //nNoPer = u.nNoPer,
            //sNomEmpl = u.SNomEmpl,
            //nNoPer = u.NNoPer,
            //nUsrClv = u.NUsrClv,
            //sCorreo = u.SCorreo,
            //nUResClv = u.NUResClv,
            //sUResNom = u.SUResNom,
            //nRegClv = u.NRegClv,
            //sRegNom = u.SRegNom,
            //sPueEmpl = u.SPueEmpl
        });

        return Json(resultados);
    }

    [HttpPost]
    public IActionResult PrevisualizarBorrador([FromForm] VmSolicitud vmSolicitud, [FromForm] string sTipo)
    {
        try
        {
            byte[] pdfBytes = null;
            if (sTipo == "Finanzas")
            {
                pdfBytes = _generador.GenerarPDF_FINANZAS(vmSolicitud);
            }
            else if (sTipo == "Humanos")
            {
                pdfBytes = _generador.GenerarPDF_HUMANOS(vmSolicitud);
            }
            //else if (sTipo == "Estudiantes")
            //{
            //    pdfBytes = _generador.GenerarPDF_ESTUDIANTES(vmSolicitud);
            //}
            
            string nombreDescarga = $"Borrador_{sTipo}.pdf";
            // AGREGA EL TERCER PARÁMETRO (Nombre del archivo)
            return File(pdfBytes!, "application/pdf", nombreDescarga);
        }
        catch (Exception ex)
        {
            return BadRequest("Error al generar vista previa: " + ex.Message);
        }
    }

    [HttpPost]
    public IActionResult DescargarZipBorrador([FromForm] VmSolicitud vmSolicitud)
    {
        try
        {
            // 1. Obtener datos (Manejo de nulos)
            string nombreZip = $"Paquete_Solicitudes_{DateTime.UtcNow:yyyy-MM-dd_HH-mm-ss-fff}.zip";

            using (var ms = new MemoryStream())
            {
                // Creamos el archivo ZIP en memoria
                using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, true))
                {
                    // --- A. FINANZAS (Si está activo) ---
                    if (vmSolicitud.MoFinanzas.BActivo)
                    {
                        try
                        {
                            var bytesFina = _generador.GenerarPDF_FINANZAS(vmSolicitud);
                            var entry = archive.CreateEntry($"Finanzas.pdf");
                            using (var stream = entry.Open()) stream.Write(bytesFina, 0, bytesFina.Length);
                        }
                        catch (Exception ex)
                        {
                            // Opcional: Escribir un .txt con el error dentro del zip
                        }
                    }

                    // --- B. HUMANOS (Si está activo) ---
                    if (vmSolicitud.MoHumanos.BActivo)
                    {
                        try
                        {
                            var bytesHuma = _generador.GenerarPDF_HUMANOS(vmSolicitud);
                            var entry = archive.CreateEntry($"Humanos.pdf");
                            using (var stream = entry.Open()) stream.Write(bytesHuma, 0, bytesHuma.Length);
                        }
                        catch (Exception ex) { }
                    }
                } // Cierre del ZipArchive

                // 2. Devolver el ZIP
                ms.Position = 0;
                return File(ms.ToArray(), "application/zip", nombreZip);
            }
        }
        catch (Exception ex)
        {
            return BadRequest("Error generando el paquete ZIP: " + ex.Message);
        }
    }

}