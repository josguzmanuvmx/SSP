using DocumentFormat.OpenXml;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSP.Data;
using SSP.Extensions;
using SSP.Functions;
using SSP.Models;
using SSP.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.IO.Compression;
using System.Reflection;
using System.Text.Json;

[Authorize(Policy = "ModulosPolicy")]
public class SolicitudController : Controller
{
    private readonly DaEmpleado _daEmpleado;
    private readonly DaSolicitud _daSolicitud;
    private readonly ClsEncrypt _encrypt;
    private readonly ClsGenerarSolicitud _generador;

    public SolicitudController(DaEmpleado daEmpleado, DaSolicitud daSolicitud, IConfiguration config, ClsGenerarSolicitud generador)
    {
        _daEmpleado = daEmpleado;
        _daSolicitud = daSolicitud;
        _encrypt = new ClsEncrypt(config);
        _generador = generador;
    }

    [HttpGet]
    public IActionResult Index()
    {
        var vmSolicitud = new VmSolicitud();
        return View(new VmSolicitud());
    }

    [HttpPost]
    [ValidateAntiForgeryToken] // 1. Seguridad contra ataques CSRF
    public async Task<IActionResult> Guardar(VmSolicitud vm)
    {
        // 1. Validar estado del modelo (Back-end validation)
        // Nota: Ignoramos errores de propiedades complejas si las vamos a construir manualmente
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return Json(new { success = false, message = "Datos incompletos", errors = errors });
        }

        try
        {
            // 2. Crear la Entidad de BD
            var solicitudDb = new MoSolicitud
            {
                // Datos Raíz
                SNomEmpl = vm.SNomEmpl,
                NNoPer = vm.NNoPer,
                SUsuario = vm.SUsuario,
                SCorreo = vm.SCorreo,
                NUResClv = vm.NUResClv,
                NRegClv = vm.NRegClv,
                SPueEmpl = vm.SPueEmpl,

                // Datos de Control
                NEstado = vm.NEstado ?? 1,
                DtFecCre = DateTime.Now,
                DtUltAct = DateTime.Now,
                SAutor = User.Identity?.Name ?? "Sistema",
                BActivo = true,

                // 4. SERIALIZACIÓN JSON (Aquí convertimos los objetos a string)

                // Estudiantes
                DcEstuJson = JsonSerializer.Serialize(vm.MoEstudiantes),

                // Finanzas (Usamos el objeto que llenamos arriba)
                DcFinaJson = JsonSerializer.Serialize(vm.MoFinanzas),

                // Humanos
                DcHumaJson = JsonSerializer.Serialize(vm.MoHumanos)
            };

            // 3. Guardar en Base de Datos
            // Asumiendo que usas Entity Framework y tu contexto se llama _context
            _daSolicitud.Agregar(solicitudDb);

            return Json(new { success = true, message = "Solicitud guardada correctamente." });
        }
        catch (Exception ex)
        {
            // Log error (Console.WriteLine(ex.Message));
            return Json(new { success = false, message = "Error interno: " + ex.Message });
        }
    }

    [HttpGet]
    public IActionResult Editar(string sId)
    {
        // 1. VALIDACIÓN Y DESENCRIPTACIÓN DEL ID
        if (string.IsNullOrEmpty(sId))
        {
            return RedirectToAction("Index", "Solicitudes");
        }

        int nId = 0;
        try
        {
            // A. Restaurar caracteres URL (por si el navegador cambió + por espacio)
            string idLimpio = Uri.UnescapeDataString(sId);

            // B. Desencriptar usando tu clase
            string idDesencriptado = _encrypt.FnsDesEncripta(idLimpio);

            // C. Convertir a entero real (Ahora sí funcionará)
            if (!int.TryParse(idDesencriptado, out nId))
            {
                return RedirectToAction("Index", "Solicitud");
            }
        }
        catch (Exception)
        {
            // Si el usuario manipuló la URL y el hash es inválido
            return RedirectToAction("Index", "Solicitud");
        }

        // 2. BUSCAR EN BD
        var dbItem = _daSolicitud.ObtenerPorId(nId);

        if (dbItem == null) return NotFound();

        Region enumValue = dbItem.NRegClv.HasValue
                       ? (Region)dbItem.NRegClv.Value
                       : Region.SXal;

        // Ahora aplicamos tu lógica de Reflection para obtener el Nombre y el Código
        // Nota: Agregué 'FirstOrDefault()' para seguridad y el 'using' necesario
        string sRegNom = enumValue.GetType()
                            .GetMember(enumValue.ToString())
                            .FirstOrDefault()? // Usar FirstOrDefault evita crash si algo raro pasa
                            .GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>()?
                            .Name ?? enumValue.ToString();

        // Si también necesitas la clave personalizada (ClsClaveRegion)
        string sRegClv = enumValue.GetType()
                            .GetMember(enumValue.ToString())
                            .FirstOrDefault()?
                            .GetCustomAttribute<ClsClaveRegion>()?
                            .Codigo ?? string.Empty;

        // 3. MAPEO MANUAL: BD Entity -> ViewModel
        var vmSolicitud = new VmSolicitud
        {
            // IMPORTANTE: Volvemos a ENCRIPTAR el ID para mandarlo a la vista.
            // Así, el <input type="hidden" asp-for="SId" /> tendrá el valor seguro
            // y cuando des clic en "Guardar", el método Actualizar recibirá el ID encriptado.
            SId = Uri.EscapeDataString(_encrypt.FnsEncripta(dbItem.NId.ToString())?.SEncript ?? ""),

            // Pasamos el folio para mostrarlo en el título (ej: "Editando Solicitud SOL-2024...")
            SFolio = dbItem.SFolio,

            // Datos planos
            SNomEmpl = dbItem.SNomEmpl,
            NNoPer = dbItem.NNoPer,
            SUsuario = dbItem.SUsuario,
            SCorreo = dbItem.SCorreo,
            NUResClv = dbItem.NUResClv,
            SUResNom = Enum.GetValues(typeof(ClsCatalogoDependencias))
                   .Cast<ClsCatalogoDependencias>()
                   .Where(x => int.Parse(x.GetDisplayName()) == dbItem.NUResClv) // Asumiendo que GetDisplayName() devuelve el número como string "100", "110"
                   .Select(x => x.GetDescription()) // Obtenemos el nombre "Facultad de X"
                   .FirstOrDefault() ?? "Dependencia no encontrada",

            // Casteo de Int a Enum
            

            Region = dbItem.NRegClv.HasValue ? (Region)dbItem.NRegClv.Value : Region.SXal,

            SRegNom = sRegNom,

            NRegClv = dbItem.NRegClv,

            SPueEmpl = dbItem.SPueEmpl,
            NEstado = dbItem.NEstado,
            BActivo = dbItem.BActivo,

            MoFinanzas = JsonSerializer.Deserialize<MoFinanzas>(dbItem.DcFinaJson),
            MoEstudiantes = JsonSerializer.Deserialize<MoEstudiantes>(dbItem.DcEstuJson),
            MoHumanos = JsonSerializer.Deserialize<MoHumanos>(dbItem.DcHumaJson)
        };

        // 5. RETORNAR LA VISTA
        // Asegúrate de que "Index" sea la vista donde está tu formulario.
        // Si tu formulario está en una vista llamada "Crear.cshtml" o "Formulario.cshtml", cámbialo aquí.
        return View("Index", vmSolicitud);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Actualizar(VmSolicitud vm)
    {
        // 1. Validar Modelo
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return Json(new { success = false, message = "Datos inválidos", errors = errors });
        }

        try
        {
            // 2. Obtener y Validar ID
            if (string.IsNullOrEmpty(vm.SId) || !int.TryParse(vm.SId, out int nId))
            {
                return Json(new { success = false, message = "ID de solicitud inválido." });
            }

            // 3. Recuperar la entidad ORIGINAL de la BD
            // Esto es vital para mantener el ID, SAutor y DtFecCre originales
            var solicitudDb = _daSolicitud.ObtenerPorId(nId);

            if (solicitudDb == null)
            {
                return Json(new { success = false, message = "La solicitud no existe o fue eliminada." });
            }

            // 4. Actualizar campos planos (Sobreescribimos con lo que viene del form)
            solicitudDb.SNomEmpl = vm.SNomEmpl;
            solicitudDb.NNoPer = vm.NNoPer;
            solicitudDb.SUsuario = vm.SUsuario;
            solicitudDb.SCorreo = vm.SCorreo;
            solicitudDb.NUResClv = vm.NUResClv;
            solicitudDb.NRegClv = vm.NRegClv; // El setter del VM ya convirtió el Enum a Int
            solicitudDb.SPueEmpl = vm.SPueEmpl;

            // Actualizamos metadatos de modificación
            solicitudDb.DtUltAct = DateTime.Now;
            solicitudDb.BActivo = true; // O vm.BActivo si permites desactivar desde aquí

            // 5. SERIALIZACIÓN JSON (Convertir Objetos -> String)
            // Como ya no usas booleanos sueltos, serializamos directo el objeto del VM

            // Estudiantes
            solicitudDb.DcEstuJson = JsonSerializer.Serialize(vm.MoEstudiantes);

            // Finanzas
            solicitudDb.DcFinaJson = JsonSerializer.Serialize(vm.MoFinanzas);

            // Humanos
            solicitudDb.DcHumaJson = JsonSerializer.Serialize(vm.MoHumanos);

            // 6. Guardar cambios en BD
            _daSolicitud.Actualizar(solicitudDb);

            return Json(new { success = true, message = "Solicitud actualizada correctamente." });
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = "Error al actualizar: " + ex.Message });
        }
    }

    [HttpGet]
    public IActionResult BuscarUsuarios(string sUsuario)
    {
        // Llama al nuevo método en tu servicio
        var lsUsuarios = _daEmpleado.BuscarUsuarios(sUsuario);

        // Formatea los datos para que el autocompletado los entienda
        var resultados = lsUsuarios.Select(u => new
        {
            // El texto a mostrar, ej: "Ángel Guzmán (angel) - 12345"
            label = $"[{u.NNoPersonal}] {u.SUsuario} - {u.SNombre}",

            // Los datos que usaremos para rellenar el formulario
            sNomEmpl = "José Ángel Guzmán Zavaleta",
            nNoPer = 61399,
            sUsuario = "josguzman",
            sCorreo = "josguzman@uv.mx",
            nUResClv = 1,
            sUResNom = "USII",
            nRegClv = 1,
            Region = 1,
            sPueEmpl = "Becario"

            //sNomEmpl = u.sNomEmpl,
            //nNoPer = u.nNoPer,
            //sNomEmpl = u.SNomEmpl,
            //nNoPer = u.NNoPer,
            //sUsuario = u.SUsuario,
            //sCorreo = u.SCorreo,
            //nUResClv = u.NUResClv,
            //sUResNom = u.SUResNom,
            //nRegClv = u.NRegClv,
            //sRegNom = u.SRegNom,
            //sPueEmpl = u.SPueEmpl
        });

        return Json(resultados);
    }

    [HttpPost]
    public IActionResult PrevisualizarBorrador([FromForm] VmSolicitud vmSolicitud, [FromForm] string sTipo)
    {
        try
        {
            byte[] pdfBytes = null;
            if (sTipo == "Finanzas")
            {
                pdfBytes = _generador.GenerarPDF_FINANZAS(vmSolicitud);
            }
            else if (sTipo == "Humanos")
            {
                pdfBytes = _generador.GenerarPDF_HUMANOS(vmSolicitud);
            }
            //else if (sTipo == "Estudiantes")
            //{
            //    pdfBytes = _generador.GenerarPDF_ESTUDIANTES(vmSolicitud);
            //}
            
            string nombreDescarga = $"Borrador_{sTipo}.pdf";
            // AGREGA EL TERCER PARÁMETRO (Nombre del archivo)
            return File(pdfBytes!, "application/pdf", nombreDescarga);
        }
        catch (Exception ex)
        {
            return BadRequest("Error al generar vista previa: " + ex.Message);
        }
    }

    [HttpPost]
    public IActionResult DescargarZipBorrador([FromForm] VmSolicitud vmSolicitud)
    {
        try
        {
            // 1. Obtener datos (Manejo de nulos)
            string nombreZip = $"Paquete_Solicitudes_{DateTime.UtcNow:yyyy-MM-dd_HH-mm-ss-fff}.zip";

            using (var ms = new MemoryStream())
            {
                // Creamos el archivo ZIP en memoria
                using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, true))
                {
                    // --- A. FINANZAS (Si está activo) ---
                    if (vmSolicitud.MoFinanzas.BActivo)
                    {
                        try
                        {
                            var bytesFina = _generador.GenerarPDF_FINANZAS(vmSolicitud);
                            var entry = archive.CreateEntry($"Finanzas.pdf");
                            using (var stream = entry.Open()) stream.Write(bytesFina, 0, bytesFina.Length);
                        }
                        catch (Exception ex)
                        {
                            // Opcional: Escribir un .txt con el error dentro del zip
                        }
                    }

                    // --- B. HUMANOS (Si está activo) ---
                    if (vmSolicitud.MoHumanos.BActivo)
                    {
                        try
                        {
                            var bytesHuma = _generador.GenerarPDF_HUMANOS(vmSolicitud);
                            var entry = archive.CreateEntry($"Humanos.pdf");
                            using (var stream = entry.Open()) stream.Write(bytesHuma, 0, bytesHuma.Length);
                        }
                        catch (Exception ex) { }
                    }
                } // Cierre del ZipArchive

                // 2. Devolver el ZIP
                ms.Position = 0;
                return File(ms.ToArray(), "application/zip", nombreZip);
            }
        }
        catch (Exception ex)
        {
            return BadRequest("Error generando el paquete ZIP: " + ex.Message);
        }
    }

    [HttpGet]
    public IActionResult BuscarDependencias(string sTermino)
    {
        if (string.IsNullOrWhiteSpace(sTermino) || sTermino.Length < 3)
        {
            return Json(new List<ItemDependencia>());
        }

        string termino = sTermino.ToUpper();

        // Ahora el código es mucho más limpio:
        var listaCompleta = Enum.GetValues(typeof(ClsCatalogoDependencias))
            .Cast<ClsCatalogoDependencias>()
            .Select(e => new ItemDependencia
            {
                // Usamos las extensiones que acabamos de crear
                SCodigo = e.GetDisplayName(),      // Lee .Name
                SDependencia = e.GetDescription()  // Lee .Description
            });

        var resultados = listaCompleta
            .Where(x => (x.SCodigo != null && x.SCodigo.Contains(termino)) ||
                        (x.SDependencia != null && x.SDependencia.Contains(termino)))
            .Take(15)
            .ToList();

        return Json(resultados);
    }

}