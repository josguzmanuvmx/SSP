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

    [HttpGet]
    public IActionResult Index()
    {
        var lsVmSolicitud = new List<VmSolicitud>();
        var lsMoSolicitud = new List<MoSolicitud>();

        foreach (var moSolicitud in lsMoSolicitud)
        {
            string sIdEncrypt = _encrypt.FnsEncripta(moSolicitud.NId.ToString())?.SEncript ?? "";

            VmSolicitud vmSolicitud = new()
            {
                SId = sIdEncrypt
            };

            lsVmSolicitud.Add(vmSolicitud);
        }
        return View(lsVmSolicitud);
    }
}