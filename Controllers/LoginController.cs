using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;

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

    //[HttpPost]
    //public IActionResult IniciarSesion(VmIniciarSesion model)
    //{
    //    if (model.SUsuario == null || model.SContra == null)
    //    {
    //        ModelState.AddModelError(string.Empty, "El usuario y la contraseña son obligatorios.");
    //        return View("Index", model);
    //    }
    //    if (ModelState.IsValid)
    //    {
    //        Console.WriteLine("Validando credenciales para usuario: " + model.SUsuario);

    //        // 3. Usa tu servicio para validar las credenciales
    //        if (_svLogin.ValidarCredenciales(model.SUsuario, model.SContra))
    //        {
    //            // Aquí iría la lógica para crear la sesión (cookie)
    //            return RedirectToAction("Index", "Inicio");
    //        }
    //        else
    //        {
    //            ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
    //        }
    //    }
    //    return View("Index", model);
    //}

    [HttpPost]
    // ¡Debe ser async Task para usar 'await' al iniciar sesión!
    public async Task<IActionResult> IniciarSesion(VmIniciarSesion model)
    {
        if (ModelState.IsValid)
        {
            if (_svLogin.ValidarCredenciales(model.SUsuario ?? "", model.SContra ?? ""))
            {
                if (model.SUsuario == null || model.SContra == null) { return View("Index", model); }
                // Obtener roles
                List<string> rolesDelUsuario = _svLogin.ObtenerRoles(model.SUsuario);
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, model.SNombre ?? "Sin usuario"),
                };
                foreach (var rol in rolesDelUsuario)
                {
                    claims.Add(new Claim(ClaimTypes.Role, rol));
                }
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));
                return RedirectToAction("Index", "Inicio");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
            }
        }
        return View("Index", model);
    }

    // --- AÑADE UNA ACCIÓN DE LOGOUT ---
    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Index", "Login");
    }
}