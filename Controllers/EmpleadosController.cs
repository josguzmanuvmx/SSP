using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiSProI.Data;
using SiSProI.Functions;
using SSP.Data;
using SSP.Models;
using SSP.ViewModels;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

[Authorize(Policy = "AdminPolicy")]
public class EmpleadosController : Controller
{
    private readonly DaEmpleado _daEmpleados;
    private readonly ClsEncrypt _encrypt;

    public EmpleadosController(DaEmpleado daEmpleados, IConfiguration config)
    {
        _daEmpleados = daEmpleados;
        _encrypt = new ClsEncrypt(config);
    }

    [HttpGet]
    public IActionResult Index()
    {
        var lsEmpleados = _daEmpleados.Obtener();
        var lsVmEmpleados = new List<VmEmpleado>();

        foreach (var moEmpleado in lsEmpleados)
        {
            string sIdEncrypt = _encrypt.FnsEncripta(moEmpleado.NId.ToString())?.SEncrypt ?? "";

            VmEmpleado vmEmpleado = new()
            {
                SId = sIdEncrypt,
                NNoPersonal = moEmpleado.NNoPersonal,
                SUsuario = moEmpleado.SUsuario,
                BAdmin = moEmpleado.BAdmin,
                BSiisu = moEmpleado.BSiisu,
                BSprfm = moEmpleado.BSprfm,
                BActivo = moEmpleado.BActivo
            };
            lsVmEmpleados.Add(vmEmpleado);
        }
        return View(lsVmEmpleados);
    }

    //[HttpPost]
    //[ValidateAntiForgeryToken]
    //public IActionResult Agregar(VmEmpleado vmEmpleado)
    //{
    //    Console.WriteLine(vmEmpleado);
    //    Console.WriteLine(vmEmpleado.NNoPersonal);
    //    Console.WriteLine(vmEmpleado.SUsuario);
    //    if (ModelState.IsValid)
    //    {
    //        try
    //        {
    //            int nId = int.Parse(_encrypt.FnsDesEncripta(vmEmpleado.SId));

    //            MoEmpleado moEmpleado = new()
    //            {
    //                NId = nId,
    //                NNoPersonal = moEmpleado.NNoPersonal,
    //                SUsuario = moEmpleado.SUsuario,
    //                BAdmin = moEmpleado.BAdmin,
    //                BSiisu = moEmpleado.BSiisu,
    //                BSprfm = moEmpleado.BSprfm,
    //                BActivo = moEmpleado.BActivo
    //            };
    //            _daEmpleados.Agregar(moEmpleado);
    //            return RedirectToAction(nameof(Index));
    //        }
    //        catch (Exception ex)
    //        {
    //            ModelState.AddModelError(string.Empty, $"Error al guardar: {ex.Message}");
    //        }
    //    }
    //    return View("AgregarEditar", moEmpleado);
    //}

    [HttpGet]
    public IActionResult Agregar()
    {
        return View("AgregarEditar", new VmEmpleado { BActivo = true });
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

    [HttpGet]
    public IActionResult EmpleadoExiste(string sUsuario)
    {
        if (string.IsNullOrEmpty(sUsuario))
        {
            // Devuelve 'false' si el sUsuario está vacío
            return Json(new { existe = false });
        }

        // Llama al nuevo método en tu servicio
        bool bExiste = _daEmpleados.EmpleadoExiste(sUsuario);

        // Devuelve el resultado como JSON (ej. { "existe": true })
        return Json(new { existe = bExiste });
    }

    [HttpGet]
    public IActionResult Editar(string sId)
    {
        int nId = string.IsNullOrEmpty(sId)
                ? 0
                : int.Parse(_encrypt.FnsDesEncripta(sId!));
        var moEmpleado = _daEmpleados.ObtenerPorId(nId);
        if (moEmpleado == null)
        {
            return NotFound();
        }
        string sIdEncrypt = _encrypt.FnsEncripta(moEmpleado.NId.ToString())?.SEncrypt ?? "";
        VmEmpleado vmEmpleado = new()
        {
            SId = sIdEncrypt,
            NNoPersonal = moEmpleado.NNoPersonal,
            SUsuario = moEmpleado.SUsuario,
            BAdmin = moEmpleado.BAdmin,
            BSiisu = moEmpleado.BSiisu,
            BSprfm = moEmpleado.BSprfm,
            BActivo = moEmpleado.BActivo
        };
        return View("AgregarEditar", vmEmpleado);
    }

    [HttpPost]
    [ValidateAntiForgeryToken] // Buena práctica de seguridad
    public IActionResult Guardar(VmEmpleado vmEmpleado)
    {
        // 1. Comprueba si los datos del formulario son válidos
        //    (Revisa [Required], [MaxLength], etc. de tu MoEmpleado)
        if (!ModelState.IsValid)
        {
            // Si hay un error (ej. sUsuario vacío),
            // vuelve a mostrar el formulario con los datos y los errores.
            return View("AgregarEditar", vmEmpleado);
        }

        try
        {
            int nId = string.IsNullOrEmpty(vmEmpleado.SId)
                ? 0
                : int.Parse(_encrypt.FnsDesEncripta(vmEmpleado.SId!));

            var moEmpleado = new MoEmpleado
            {
                NId = nId,
                NNoPersonal = vmEmpleado.NNoPersonal,
                SUsuario = vmEmpleado.SUsuario,
                BAdmin = vmEmpleado.BAdmin,
                BSiisu = vmEmpleado.BSiisu,
                BSprfm = vmEmpleado.BSprfm,
                BActivo = vmEmpleado.BActivo
            };
            // 2. Lógica "Upsert" (Update + Insert)
            if (nId == 0)
            {
                // Si el ID es 0, es un empleado NUEVO
                _daEmpleados.Agregar(moEmpleado);
            }
            else
            {
                // Si el ID es diferente de 0, es un empleado EXISTENTE
                _daEmpleados.Actualizar(moEmpleado);
            }

            // 3. Si todo salió bien, redirige a la lista
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            // 4. Si la BD da un error (ej. 'sUsuario' ya existe)
            //    se lo mostramos al usuario.
            ModelState.AddModelError(string.Empty, $"Error al guardar: {ex.Message}");

            // Vuelve a mostrar el formulario con el error
            return View("AgregarEditar", vmEmpleado);
        }
    }


}