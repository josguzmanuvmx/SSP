using SSP.Data;
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SiSProI.Data;

[Authorize(Policy = "AdminPolicy")]
public class EmpleadosController : Controller
{
    private readonly DaEmpleado _daEmpleados;

    public EmpleadosController(DaEmpleado daEmpleados)
    {
        _daEmpleados = daEmpleados;
    }

    // 3. Usa el servicio en tu acción Index
    public IActionResult Index()
    {
        var listaDeEmpleados = _daEmpleados.Obtener();
        return View(listaDeEmpleados);
    }

    public IActionResult Agregar()
    {
        return View();
    }

    [HttpGet]
    public IActionResult BuscarUsuarios(string sUsuario)
    {
        // Llama al nuevo método en tu servicio
        var lsUsuarios = _daEmpleados.BuscarUsuarios(sUsuario);

        // Formatea los datos para que el autocompletado los entienda
        var resultados = lsUsuarios.Select(u => new
        {
            // El texto a mostrar, ej: "Ángel Guzmán (angel) - 12345"
            label = $"{u.NNoPersonal} - {u.SNombre}",

            // Los datos que usaremos para rellenar el formulario
            sUsuario = u.SUsuario,
            nNoPersonal = u.NNoPersonal
        });

        return Json(resultados);
    }

    public IActionResult Editar()
    {
        return View();
    }
}