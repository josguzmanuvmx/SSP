using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;

public class SeleccionController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}