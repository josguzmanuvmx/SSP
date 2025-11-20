using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize(Policy = "ModulosPolicy")]
public class SeleccionController : Controller
{
    public IActionResult Index()
    {
        var moPermiso = new MoPermiso() {};
        return View("Index", moPermiso);
    }

    public IActionResult Sprfm()
    {
        var moPermiso = new MoPermiso() { STipo = "Sprfm" };
        return View("Index", moPermiso);
    }

    public IActionResult Siisu()
    {
        var moPermiso = new MoPermiso() { STipo = "Siisu" };
        return View("Index", moPermiso);
    }
}