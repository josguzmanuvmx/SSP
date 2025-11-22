using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSP.Data;
using SSP.ViewModels;
using System.Reflection;
using SSP.Extensions;
using System.Text;
using Xceed.Words.NET;

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
        return View();
    }

    public IActionResult Crear()
    {
        var modelo = new VmSprfmAct
        {
            // Inicializamos el formulario vacío
            vmSprfm = new VmSoliSprfm(),

            // 2. ¡AQUÍ ESTÁ LA MAGIA!
            // Convertimos el Enum en una lista de objetos para la vista
            lsActividades = Enum.GetValues(typeof(ClsSprfmActividades))
                            .Cast<ClsSprfmActividades>()
                            .Select(a => new ItemActividad
                            {
                                SNombre = a.GetDisplayName(),
                                SDescripcion = a.GetDescription() // Aquí recuperamos el HTML de la lista
                            })
                            .ToList()
        };

        return View("Crear", modelo);
    }

    public static string GetDisplayName(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>()?
            .Name ?? enumValue.ToString();
    }

    public static string GetCodigoRegion(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<ClsClaveRegion>()
            ?.Codigo ?? string.Empty;
    }

    public static string GetNombreSinNumero(Enum enumValue)
    {
        string nombreCompleto = GetDisplayName(enumValue);
        int indicePunto = nombreCompleto.IndexOf('.');
        if (indicePunto >= 0)
        {
            return nombreCompleto.Substring(indicePunto + 1).Trim();
        }
        return nombreCompleto;
    }

    [HttpPost]
    public IActionResult DescargarSolicitud(VmSoliSprfm model)
    {
        string plantillaPath = Path.Combine(_hostingEnvironment.WebRootPath, "templates", "sprfm.docx");

        using (var doc = DocX.Load(plantillaPath))
        {
            doc.ReplaceText("{d}", DateTime.Now.ToString("dd"));
            doc.ReplaceText("{m}", DateTime.Now.ToString("MM"));
            doc.ReplaceText("{a}", DateTime.Now.ToString("yyyy"));

            doc.ReplaceText("{nombreEmpleado}", model.SNombreEmpleado ?? "");
            doc.ReplaceText("{noPersonal}", model.NNumeroPersonal.ToString());
            doc.ReplaceText("{correoInst}", model.SCorreoInstitucional ?? "");
            doc.ReplaceText("{uRC}", model.NUnidadResponsableClave.ToString());
            doc.ReplaceText("{uRN}", model.SUnidadResponsableNombre ?? "");
            doc.ReplaceText("{rC}", GetCodigoRegion(model.SRegion));
            doc.ReplaceText("{rN}", GetNombreSinNumero(model.SRegion));
            doc.ReplaceText("{puestoEmpleado}", model.SPuestoEmpleado ?? "");

            var parOld = doc.Paragraphs.FirstOrDefault(p => p.Text.Contains("{especificaciones}"));
            if (parOld != null)
            {
                // 2. Borra el texto del marcador para empezar limpio
                var par = parOld.InsertParagraphAfterSelf("");

                // --- A. REVISOR (Mezclado: Negrita + Normal) ---
                if (model.SPermisos.BRevisor && !string.IsNullOrWhiteSpace(model.SPermisos.SDetalleRevisor))
                {
                    // Pieza 1: La etiqueta en Negrita
                    par.Append("REVISOR: ").Bold();

                    // Pieza 2: El valor en Normal (y salto de línea)
                    par.Append(model.SPermisos.SDetalleRevisor).AppendLine();
                }

                // --- B. OTRO GRUPO (Mezclado: Negrita + Normal) ---
                if (model.SPermisos.BOtroGrupo && !string.IsNullOrWhiteSpace(model.SPermisos.SDetalleOtroGrupo))
                {
                    // Pieza 1: La etiqueta en Negrita
                    par.Append("OTRO GRUPO: ").Bold();

                    // Pieza 2: El valor en Normal (y salto de línea)
                    par.Append(model.SPermisos.SDetalleOtroGrupo).AppendLine();
                }

                // --- C. UR ADICIONAL ---
                if (model.SPermisos.BUrAdicional && !string.IsNullOrWhiteSpace(model.SPermisos.SDetalleUrAdicional))
                {
                    par.Append("UR adicional: ").Bold();
                    par.Append(model.SPermisos.SDetalleUrAdicional).AppendLine();
                }

                // --- D. PERMISO ESPECÍFICO ---
                if (model.SPermisos.BPermisoEspecifico && !string.IsNullOrWhiteSpace(model.SPermisos.SDetallePermisoEspecifico))
                {
                    par.Append("Permiso específico: ").Bold();
                    par.Append(model.SPermisos.SDetallePermisoEspecifico).AppendLine();
                }

                // --- E. PERMISO SIMILAR ---
                if (model.SPermisos.BPermisoSimilar && !string.IsNullOrWhiteSpace(model.SPermisos.SDetallePermisoSimilar))
                {
                    par.Append("Permisos similares a: ").Bold();
                    par.Append(model.SPermisos.SDetallePermisoSimilar).AppendLine();
                }
                parOld.Remove(false);
            }

            doc.ReplaceText("{alta}", model.SAccionPermiso == SprfmAccion.SAlta ? "☒" : "☐");
            doc.ReplaceText("{modificacion}", model.SAccionPermiso == SprfmAccion.SModificacion ? "☒" : "☐");
            doc.ReplaceText("{baja}", model.SAccionPermiso == SprfmAccion.SBaja ? "☒" : "☐");

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

            var stream = new MemoryStream();
            doc.SaveAs(stream);
            stream.Position = 0;

            string mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            string nombreArchivo = $"SPRFM_{DateTime.Now:yyyyMMdd_HHmmss}.docx";

            return File(stream, mimeType, nombreArchivo);
        }
    }


}