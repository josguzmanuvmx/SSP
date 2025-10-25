using Microsoft.AspNetCore.Mvc;
using SSP.ViewModels;

namespace SSP.Controllers
{
    public class LoginController : Controller
    {
        // GET: /Login/Index
        // Esta acción simplemente muestra el formulario de login vacío la primera vez.
        public IActionResult Index()
        {
            return View();
        }

        // POST: /Login/IniciarSesion
        [HttpPost]
        public IActionResult IniciarSesion(VmIniciarSesion model)
        {
            // 1. Verifica si el modelo es válido (ej. campos requeridos)
            if (ModelState.IsValid)
            {
                // 2. Lógica de autenticación
                if (model.SUsuario == "admin" && model.SContra == "12345")
                {
                    // ✅ ÉXITO: Redirige al dashboard o página principal.
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    // ❌ FALLO: Agrega el error al ModelState.
                    ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
                }
            }

            // 3. Si el login falló o el modelo no es válido, devuelve la VISTA ACTUAL
            //    con el modelo. Esto preserva los datos ingresados y los mensajes de error.
            //    Cambiamos RedirectToAction por View("Index", model).
            return View("Index", model);
        }
    }
}