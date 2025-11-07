using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;

public class LoginController : Controller
{
    private readonly DaLogin _svLogin; // 1. Cambia DbContext por tu interfaz

    // 2. Inyecta la interfaz en el constructor
    public LoginController(DaLogin userService)
    {
        _svLogin = userService;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public IActionResult IniciarSesion(VmIniciarSesion model)
    {
        if (model.SUsuario == null || model.SContra == null)
        {
            ModelState.AddModelError(string.Empty, "El usuario y la contraseña son obligatorios.");
            return View("Index", model);
        }
        if (ModelState.IsValid)
        {
            Console.WriteLine("Validando credenciales para usuario: " + model.SUsuario);

            // 3. Usa tu servicio para validar las credenciales
            if (_svLogin.ValidarCredenciales(model.SUsuario, model.SContra))
            {
                // Aquí iría la lógica para crear la sesión (cookie)
                return RedirectToAction("Index", "Inicio");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
            }
        }
        return View("Index", model);
    }
}