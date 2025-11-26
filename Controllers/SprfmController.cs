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
    public IActionResult DescargarSolicitud(VmSprfmAct vmSprfmAct)
    {
        var vmSoliSprfm = vmSprfmAct.vmSprfm ?? new VmSoliSprfm();
        string plantillaPath = Path.Combine(_hostingEnvironment.WebRootPath, "templates", "sprfm.docx");

        using (var doc = DocX.Load(plantillaPath))
        {
            doc.ReplaceText("{d}", DateTime.Now.ToString("dd"));
            doc.ReplaceText("{m}", DateTime.Now.ToString("MM"));
            doc.ReplaceText("{a}", DateTime.Now.ToString("yyyy"));

            doc.ReplaceText("{nombreEmpleado}", vmSoliSprfm.SNombreEmpleado ?? "");
            doc.ReplaceText("{noPersonal}", vmSoliSprfm.NNumeroPersonal.ToString());
            doc.ReplaceText("{correoInst}", vmSoliSprfm.SCorreoInstitucional ?? "");
            doc.ReplaceText("{uRC}", vmSoliSprfm.NUnidadResponsableClave.ToString());
            doc.ReplaceText("{uRN}", vmSoliSprfm.SUnidadResponsableNombre ?? "");
            doc.ReplaceText("{rC}", GetCodigoRegion(vmSoliSprfm.SRegion));
            doc.ReplaceText("{rN}", GetNombreSinNumero(vmSoliSprfm.SRegion));
            doc.ReplaceText("{puestoEmpleado}", vmSoliSprfm.SPuestoEmpleado ?? "");

            var parOld = doc.Paragraphs.FirstOrDefault(p => p.Text.Contains("{especificaciones}"));
            if (parOld != null)
            {
                // 2. Borra el texto del marcador para empezar limpio
                var par = parOld.InsertParagraphAfterSelf("");

                // --- A. REVISOR (Mezclado: Negrita + Normal) ---
                if (vmSoliSprfm.SPermisos.BRevisor && !string.IsNullOrWhiteSpace(vmSoliSprfm.SPermisos.SDetalleRevisor))
                {
                    // Pieza 1: La etiqueta en Negrita
                    par.Append("REVISOR: ").Bold();

                    // Pieza 2: El valor en Normal (y salto de línea)
                    par.Append(vmSoliSprfm.SPermisos.SDetalleRevisor).AppendLine();
                }

                // --- B. OTRO GRUPO (Mezclado: Negrita + Normal) ---
                if (vmSoliSprfm.SPermisos.BOtroGrupo && !string.IsNullOrWhiteSpace(vmSoliSprfm.SPermisos.SDetalleOtroGrupo))
                {
                    // Pieza 1: La etiqueta en Negrita
                    par.Append("OTRO GRUPO: ").Bold();

                    // Pieza 2: El valor en Normal (y salto de línea)
                    par.Append(vmSoliSprfm.SPermisos.SDetalleOtroGrupo).AppendLine();
                }

                // --- C. UR ADICIONAL ---
                if (vmSoliSprfm.SPermisos.BUrAdicional && !string.IsNullOrWhiteSpace(vmSoliSprfm.SPermisos.SDetalleUrAdicional))
                {
                    par.Append("UR adicional: ").Bold();
                    par.Append(vmSoliSprfm.SPermisos.SDetalleUrAdicional).AppendLine();
                }

                // --- D. PERMISO ESPECÍFICO ---
                if (vmSoliSprfm.SPermisos.BPermisoEspecifico && !string.IsNullOrWhiteSpace(vmSoliSprfm.SPermisos.SDetallePermisoEspecifico))
                {
                    par.Append("Permiso específico: ").Bold();
                    par.Append(vmSoliSprfm.SPermisos.SDetallePermisoEspecifico).AppendLine();
                }

                // --- E. PERMISO SIMILAR ---
                if (vmSoliSprfm.SPermisos.BPermisoSimilar && !string.IsNullOrWhiteSpace(vmSoliSprfm.SPermisos.SDetallePermisoSimilar))
                {
                    par.Append("Permisos similares a: ").Bold();
                    par.Append(vmSoliSprfm.SPermisos.SDetallePermisoSimilar).AppendLine();
                }
                parOld.Remove(false);
            }

            doc.ReplaceText("{alta}", vmSoliSprfm.SAccionPermiso == SprfmAccion.SAlta ? "☒" : "☐");
            doc.ReplaceText("{modificacion}", vmSoliSprfm.SAccionPermiso == SprfmAccion.SModificacion ? "☒" : "☐");
            doc.ReplaceText("{baja}", vmSoliSprfm.SAccionPermiso == SprfmAccion.SBaja ? "☒" : "☐");

            doc.ReplaceText("{director}", vmSoliSprfm.SPermisos.BDirector ? "x" : "");
            doc.ReplaceText("{dirGen}", vmSoliSprfm.SPermisos.BDirectorGeneral ? "x" : "");
            doc.ReplaceText("{admin}", vmSoliSprfm.SPermisos.BAdministrador ? "x" : "");
            doc.ReplaceText("{auxAdmin}", vmSoliSprfm.SPermisos.BAuxiliarAdministrativo ? "x" : "");
            doc.ReplaceText("{resProy}", vmSoliSprfm.SPermisos.BResponsableProyecto ? "x" : "");
            doc.ReplaceText("{resCB}", vmSoliSprfm.SPermisos.BResponsableControlBienes ? "x" : "");
            doc.ReplaceText("{estudi}", vmSoliSprfm.SPermisos.BEstudiantes ? "x" : "");
            doc.ReplaceText("{eveIng}", vmSoliSprfm.SPermisos.BEventosIngreso ? "x" : "");
            doc.ReplaceText("{super}", vmSoliSprfm.SPermisos.BSupervisor ? "x" : "");
            doc.ReplaceText("{cajeros}", vmSoliSprfm.SPermisos.BCajeros ? "x" : "");
            doc.ReplaceText("{revisor}", vmSoliSprfm.SPermisos.BRevisor ? "x" : "");
            doc.ReplaceText("{otroGrupo}", vmSoliSprfm.SPermisos.BOtroGrupo ? "x" : "");
            doc.ReplaceText("{urAdic}", vmSoliSprfm.SPermisos.BUrAdicional ? "x" : "");
            doc.ReplaceText("{permEsp}", vmSoliSprfm.SPermisos.BPermisoEspecifico ? "x" : "");
            doc.ReplaceText("{asigPerm}", vmSoliSprfm.SPermisos.BPermisoSimilar ? "x" : "");

            var stream = new MemoryStream();
            doc.SaveAs(stream);
            stream.Position = 0;

            string mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            string nombreArchivo = $"SPRFM_{DateTime.Now:yyyyMMdd_HHmmss}.docx";

            return File(stream, mimeType, nombreArchivo);
        }
    }


}