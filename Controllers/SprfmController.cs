using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using SSP.Data;
using SSP.ViewModels;
using Xceed.Words.NET;
using Microsoft.AspNetCore.Authorization;

[Authorize(Policy = "SprfmPolicy")]
public class SprfmController : Controller
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public SprfmController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    public IActionResult Index()
    {
        var model = new VmSoliSprfm();
        return View(model);
    }

    [HttpPost]
    public IActionResult DescargarSolicitud(VmSoliSprfm model)
    {
        string plantillaPath = Path.Combine(_hostingEnvironment.WebRootPath, "templates", "sprfm.docx");

        using (var doc = DocX.Load(plantillaPath))
        {
            // --- Reemplazar Fecha (CORREGIDO) ---

            // "dd" -> Obtiene el número del día con dos dígitos (ej. "05")
            // (Usa "d" si prefieres un solo dígito para días 1-9, ej. "5")
            doc.ReplaceText("{d}", DateTime.Now.ToString("dd"));

            // "MM" -> Obtiene el número del mes con dos dígitos (ej. "11")
            doc.ReplaceText("{m}", DateTime.Now.ToString("MM"));

            // "yyyy" -> Obtiene el año completo (ej. "2025"). Esto ya estaba bien.
            doc.ReplaceText("{a}", DateTime.Now.ToString("yyyy"));

            // --- Reemplazar Datos del Modelo ---
            doc.ReplaceText("{nombreEmpleado}", model.SNombreEmpleado ?? "");
            doc.ReplaceText("{noPersonal}", model.NNumeroPersonal.ToString());
            doc.ReplaceText("{correoInst}", model.SCorreoInstitucional ?? "");
            doc.ReplaceText("{uRC}", model.NUnidadResponsableClave.ToString());
            doc.ReplaceText("{uRN}", model.SUnidadResponsableNombre ?? "");
            doc.ReplaceText("{rC}", model.NRegionClave.ToString());
            doc.ReplaceText("{rN}", model.SRegionNombre ?? "");
            doc.ReplaceText("{puestoEmpleado}", model.SPuestoEmpleado ?? "");
            doc.ReplaceText("{especificaciones}", model.SEspecificaciones ?? "");

            // --- Reemplazar Radio Buttons ---
            // ¡OJO! Aquí tienes un error de tipeo: {check_alta}} (una llave de más)
            // Lo corrijo a {{check_alta}} (doble llave)
            doc.ReplaceText("{alta}", model.SAccionPermiso == SprfmAccion.SAlta ? "☒" : "☐");
            doc.ReplaceText("{modificacion}", model.SAccionPermiso == SprfmAccion.SModificacion ? "☒" : "☐");
            doc.ReplaceText("{baja}", model.SAccionPermiso == SprfmAccion.SBaja ? "☒" : "☐");

            // --- Reemplazar Checkboxes ---
            // ¡OJO! Aquí usas {check_director} (llave simple)
            // Asegúrate de que todos tus marcadores usen el mismo estilo (ej. {{...}})
            doc.ReplaceText("{director}", model.SPermisos.BDirector ? "x" : "");
            doc.ReplaceText("{dirGen}", model.SPermisos.BDirectorGeneral ? "x" : "");
            doc.ReplaceText("{admin}", model.SPermisos.BAdministrador ? "x" : "");
            doc.ReplaceText("{auxAdmin}", model.SPermisos.BAuxiliarAdministrativo ? "x" : "");
            doc.ReplaceText("{resProy}", model.SPermisos.BResponsableProyecto ? "x" : "");
            doc.ReplaceText("{resCB}", model.SPermisos.BResponsableControlBienes ? "x" : "");
            doc.ReplaceText("{estudi}", model.SPermisos.BEstudiantes ? "x" : "");
            doc.ReplaceText("{eveIng}", model.SPermisos.BEventosIngreso ? "x" : "");
            doc.ReplaceText("{super}", model.SPermisos.BSupervisor ? "x" : "");
            doc.ReplaceText("{cajeros}", model.SPermisos.BCajeros ? "x" : "");
            doc.ReplaceText("{revisor}", model.SPermisos.BRevisor ? "x" : "");
            doc.ReplaceText("{otroGrupo}", model.SPermisos.BOtroGrupo ? "x" : "");
            doc.ReplaceText("{urAdic}", model.SPermisos.BUrAdicional ? "x" : "");
            doc.ReplaceText("{permEsp}", model.SPermisos.BPermisoEspecifico ? "x" : "");
            doc.ReplaceText("{asigPerm}", model.SPermisos.BPermisoSimilar ? "x" : "");


            // --- Guardar y Devolver el Archivo ---
            var stream = new MemoryStream();
            doc.SaveAs(stream);
            stream.Position = 0;

            string mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            string nombreArchivo = $"SPRFM_{DateTime.Now:yyyyMMdd_HHmmss}.docx";

            return File(stream, mimeType, nombreArchivo);
        }
    }


}