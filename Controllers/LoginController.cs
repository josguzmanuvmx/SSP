using SSP.Data; // Asegúrate de tener el using de tu servicio
using SSP.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;
using SiSProI.Data;

public class LoginController : Controller
{
    private readonly DaLogin _daLogin;
    private readonly DaEmpleado _daEmpleado;

    // 2. Inyecta la interfaz en el constructor
    public LoginController(DaLogin daLogin, DaEmpleado daEmpleado)
    {
        _daLogin = daLogin;
        _daEmpleado = daEmpleado;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> IniciarSesion(VmIniciarSesion model)
    {
        if (ModelState.IsValid)
        {
            // 3. Autenticación: Validar contra la tabla 'Usuarios'
            var usuario = _daLogin.ValidarCredenciales(model.SUsuario ?? "", model.SContra ?? "");

            if (usuario != null)
            {
                // 4. Autorización: Obtener permisos de la tabla 'Empleados'
                var empleado = _daEmpleado.ObtenerPorUsuario(usuario.SUsuario!);

                if (empleado == null)
                {
                    // El usuario existe en 'Usuarios' pero no en 'Empleados'
                    ModelState.AddModelError(string.Empty, "Usuario autenticado, pero no se encontró un perfil de empleado.");
                    return View("Index", model);
                }

                // 5. Crear la lista de "Claims"
                var claims = new List<Claim>
                {
                    // Claim para el nombre (de la tabla Usuarios)
                    new Claim(ClaimTypes.Name, usuario.SNombre ?? usuario.SUsuario ?? "Sin usuario"),
                    
                    // Claim para el ID de Empleado (muy útil más adelante)
                    new Claim("EmpleadoId", empleado.NId.ToString())
                };

                // 6. Convertir los permisos booleanos en Claims
                //    ¡NOTA! Usamos el tipo "permiso", no "Role"
                if (empleado.BAdmin)
                    claims.Add(new Claim("permiso", "admin"));
                if (empleado.BSprfm)
                    claims.Add(new Claim("permiso", "sprfm"));
                if (empleado.BSiisu)
                    claims.Add(new Claim("permiso", "siisu"));


                // 7. Crear la cookie de sesión
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                // 8. Redirigir basado en el permiso del 'empleado'
                if (empleado.BAdmin)
                {
                    return RedirectToAction("Index", "Admin");
                }
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