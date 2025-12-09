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
        int nId = string.IsNullOrEmpty(sId)
                ? 0
                : int.Parse(_encrypt.FnsDesEncripta(sId!));
        var vmSolicitud = _daSolicitud.ObtenerPorId(nId);
        if (vmSolicitud == null)
        {
            return NotFound();
        }
        string sIdEncrypt = _encrypt.FnsEncripta(vmSolicitud.NId.ToString())?.SEncript ?? "";
        VmSolicitud vmEmpleado = new()
        {
            SId = sIdEncrypt,
            NNoPersonal = vmSolicitud.NNoPersonal,
            SUsuario = vmSolicitud.SUsuario,
            BAdmin = vmSolicitud.BAdmin,
            BSiisu = vmSolicitud.BSiisu,
            BSprfm = vmSolicitud.BSprfm,
            BActivo = vmSolicitud.BActivo
        };
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
    public IActionResult BuscarEmpleado(string termino)
    {
        if (string.IsNullOrEmpty(termino) || termino.Length < 3)
        {
            return Json(new List<object>());
        }

        // Simulando datos de BD. 
        // NOTA: Cuando hagas la consulta real con Entity Framework, úsalo así:
        // _context.Empleados.Where(...).Select(e => new { ... }).ToList();

        var listaSimulada = new List<object>
    {
        new { 
            // LADO IZQUIERDO: Nombre exacto para el JSON
            // LADO DERECHO: Dato real
            sNomEmpl = "Angel Hernandez Sánchez",
            nNoPer = 12345,
            nUsrClv = 99,
            sCorreo = "angel@uv.mx",
            nUResClv = 500,
            sUResNom = "Facultad de Ingeniería",
            sRegion = 1, // El valor entero del Enum (1 = Xalapa, por ejemplo)
            sPueEmpl = "Jefe de la Unidad"
        },
        new {
            sNomEmpl = "Maria Lopez",
            nNoPer = 67890,
            nUsrClv = 101,
            sCorreo = "maria@uv.mx",
            nUResClv = 600,
            sUResNom = "Recursos Humanos",
            sRegion = 2,
            sPueEmpl = "Administrativo"
        }
    };

        // Filtramos
        var resultados = listaSimulada
            .Where(x => x.GetType().GetProperty("sNomEmpl").GetValue(x, null).ToString().ToLower().Contains(termino.ToLower()))
            .ToList();

        return Json(resultados);
    }
}