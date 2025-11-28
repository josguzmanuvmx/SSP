using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiSProI.Data;
using SiSProI.Functions;
using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.Extensions;
using SSP.Models;
using SSP.ViewModels;

[Authorize(Policy = "ModulosPolicy")]
public class SolicitudController : Controller
{
    private readonly DaEmpleado _daEmpleados;
    private readonly ClsEncrypt _encrypt;

    public SolicitudController(DaEmpleado daEmpleados, IConfiguration config)
    {
        _daEmpleados = daEmpleados;
        _encrypt = new ClsEncrypt(config);
    }

    [HttpGet]
    public IActionResult Index()
    {
        var lsEmpleados = _daEmpleados.Obtener();
        var lsVmEmpleados = new List<VmEmpleado>();

        foreach (var moEmpleado in lsEmpleados)
        {
            string sIdEncrypt = _encrypt.FnsEncripta(moEmpleado.NId.ToString())?.SEncript ?? "";

            VmEmpleado vmEmpleado = new()
            {
                SId = sIdEncrypt,
                NNoPersonal = moEmpleado.NNoPersonal,
                SUsuario = moEmpleado.SUsuario,
                BAdmin = moEmpleado.BAdmin,
                BSiisu = moEmpleado.BSiisu,
                BSprfm = moEmpleado.BSprfm,
                BActivo = moEmpleado.BActivo
            };
            lsVmEmpleados.Add(vmEmpleado);
        }

        var modelo = new VmSolicitudAct
        {
            // Inicializamos el formulario vacío
            vmSprfm = new VmSoliSprfm() {
                SNombreEmpleado = "José Ángel Guzmán Zavaleta",
                NNumeroPersonal = 61399,
                SCorreoInstitucional = "josguzman@uv.mx",
                NUnidadResponsableClave = 1,
                SUnidadResponsableNombre = "Unidad",
                SRegion = SprfmRegion.SVeracruz,
                SPuestoEmpleado = "Jefe",
            },

            // 2. ¡AQUÍ ESTÁ LA MAGIA!
            // Convertimos el Enum en una lista de objetos para la vista
            lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
                            .Cast<ClsSprfmActividades>()
                            .Select(a => new ClslActividades
                            {
                                SNombre = a.GetDisplayName(),
                                SDescripcion = a.GetDescription() // Aquí recuperamos el HTML de la lista
                            })
                            .ToList()
        };
        return View(modelo);
    }

    [HttpPost]
    public async Task<IActionResult> GuardarBorrador(VmSprfmAct modeloRecibido)
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
}