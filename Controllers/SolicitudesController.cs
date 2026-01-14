using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SSP.Data;
using SSP.Models;
using SSP.ViewModels;
using SSP.Functions;

[Authorize(Policy = "ModulosPolicy")]
public class SolicitudesController : Controller
{
    private readonly DaSolicitud _daSolicitud;
    private readonly ClsEncrypt _encrypt;

    public SolicitudesController(DaSolicitud daSolicitud, IConfiguration config)
    {
        _daSolicitud = daSolicitud;
        _encrypt = new ClsEncrypt(config);
    }

    public IActionResult Index()
    {
        // 1. Obtener la lista cruda de la base de datos
        List<MoSolicitud> listaBd = _daSolicitud.Obtener();

        // 2. Mapeo Manual (DB Entity -> ViewModel)
        // Usamos .Select() para proyectar cada elemento
        List<VmSolicitud> listaVm = listaBd.Select(dbItem => new VmSolicitud
        {
            // Convertimos el ID numérico a string (o a Hash si usas encriptación)
            SId = dbItem.NId.ToString(),

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
            NEstado = dbItem.NEstado,
            DtFecCre = dbItem.DtFecCre,

            // No es necesario deserializar los JSON (dcFina, dcEstu) para el listado principal
            // Esto hace que la carga sea mucho más rápida.
        }).OrderByDescending(x => x.DtFecCre).ToList();

        // 3. Mandamos la lista ya convertida a la vista
        return View(listaVm);
    }
}