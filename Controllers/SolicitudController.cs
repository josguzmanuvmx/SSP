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
    private readonly DaEmpleado _daEmpleado;
    private readonly DaSolicitud _daSolicitud;
    private readonly ClsEncrypt _encrypt;

    public SolicitudController(DaEmpleado daEmpleado, DaSolicitud daSolicitud, IConfiguration config)
    {
        _daEmpleado = daEmpleado;
        _daSolicitud = daSolicitud;
        _encrypt = new ClsEncrypt(config);
    }

    [HttpGet]
    public IActionResult Index()
    {
        var modelo = new VmSolicitudAct
        {
            // Inicializamos el formulario vacío
            vmSolicitud = new VmSolicitud(),

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

    [HttpGet]
    public IActionResult Agregar()
    {
        var vmSolicitudAct = new VmSolicitudAct
        {
            vmSolicitud = new VmSolicitud(),
            lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
                            .Cast<ClsSprfmActividades>()
                            .Select(a => new ClslActividades
                            {
                                SNombre = a.GetDisplayName(),
                                SDescripcion = a.GetDescription()
                            })
                            .ToList()
        };
        return View("Index", vmSolicitudAct);
    }

    [HttpGet]
    public IActionResult Editar(string sId)
    {
        var vmSolicitudAct = new VmSolicitudAct
        {
            vmSolicitud = new VmSolicitud(),
            lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
                            .Cast<ClsSprfmActividades>()
                            .Select(a => new ClslActividades
                            {
                                SNombre = a.GetDisplayName(),
                                SDescripcion = a.GetDescription()
                            })
                            .ToList()
        };
        return View("Index", vmSolicitudAct);
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

    [HttpGet]
    public IActionResult BuscarUsuarios(string sUsuario)
    {
        // Llama al nuevo método en tu servicio
        var lsUsuarios = _daEmpleado.BuscarUsuarios(sUsuario);

        // Formatea los datos para que el autocompletado los entienda
        var resultados = lsUsuarios.Select(u => new
        {
            // El texto a mostrar, ej: "Ángel Guzmán (angel) - 12345"
            label = $"{u.NNoPersonal} - {u.SNombre}",

            // Los datos que usaremos para rellenar el formulario
            sNomEmpl = "u.SNomEmpl",
            nNoPer = 124,
            nUsrClv = 156,
            sCorreo = "u.SCorreo",
            nUResClv = 178,
            sUResNom = "u.SUResNom",
            nRegClv = 1,
            sRegNom = "u.SRegNom",
            sRegion = Region.SXal,
            sPueEmpl = "u.SPueEmpl"

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
}