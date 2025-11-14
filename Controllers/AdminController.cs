using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize(Policy = "AdminPolicy")]
public class AdminController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}