namespace SSP.ViewModels;
using System.ComponentModel.DataAnnotations;

public enum SprfmAccion
{
    SAlta,
    SModificacion,
    SBaja
}

public enum SprfmRegion
{
    [Display(Name = "Xalapa")]
    [ClsClaveRegion("X")]
    SXalapaX,
    [Display(Name = "Xalapa - Martínez de la Torre")]
    [ClsClaveRegion("E")]
    SXalapaE,
    [Display(Name = "E - Xalapa - Totonacapan (Espinal)")]
    [ClsClaveRegion("E")]
    SXalapaF,
    [Display(Name = "E - Xalapa - Grandes Montañas (Tequila)")]
    [ClsClaveRegion("E")]
    SXalapaG,
    [Display(Name = "E - Xalapa - Huasteca (Ixhuatlan de Madero)")]
    [ClsClaveRegion("E")]
    SXalapaH,
    [Display(Name = "E - Xalapa - Selvas (Huazuntlan)")]
    [ClsClaveRegion("E")]
    SXalapaS,
    [Display(Name = "V - Veracruz")]
    [ClsClaveRegion("E")]
    SVeracruzV,
    [Display(Name = "S - Veracruz - Boca del Río")]
    [ClsClaveRegion("E")]
    SVeracruzB,
    [Display(Name = "Orizaba - Córdoba")]
    [ClsClaveRegion("E")]
    SOrizabaCordoba,
    [Display(Name = "Poza Rica - Tuxpan")]
    [ClsClaveRegion("E")]
    SPozaRicaTuxpan,
    [Display(Name = "Coatzacoalcos - Minatitlan")]
    [ClsClaveRegion("E")]
    SCoatzacoalcosMinatitlan
}

public class VmSoliSprfm
{
    // --- Pestaña 1: Datos del Usuario ---
    [Required(ErrorMessage = "El nombre del empleado es obligatorio.")]
    [Display(Name = "Nombre del empleado")]
    public string? SNombreEmpleado { get; set; }

    [Required(ErrorMessage = "El número de personal es obligatorio.")]
    [Display(Name = "Número de personal")]
    public int? NNumeroPersonal { get; set; }

    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo no es válido.")]
    [Display(Name = "Correo electrónico institucional")]
    public string? SCorreoInstitucional { get; set; }

    [Required(ErrorMessage = "La clave de la Unidad Responsable es obligatoria.")]
    [Display(Name = "Clave de Unidad Responsable")]
    public int? NUnidadResponsableClave { get; set; }

    [Required(ErrorMessage = "El nombre de la Unidad Responsable es obligatorio.")]
    [Display(Name = "Nombre de Unidad Responsable")]
    public string? SUnidadResponsableNombre { get; set; }

    [Required(ErrorMessage = "La clave de la Región es obligatoria.")]
    [Display(Name = "Clave de Región")]
    public int? NRegionClave { get; set; }

    [Required(ErrorMessage = "El nombre de la Región es obligatorio.")]
    [Display(Name = "Nombre de Región")]
    public string? SRegionNombre { get; set; }
    public SprfmRegion SRegion { get; set; }

    [Required(ErrorMessage = "El puesto del empleado es obligatorio.")]
    [Display(Name = "Puesto del empleado")]
    public string? SPuestoEmpleado { get; set; }

    // --- Pestaña 2: Permisos ---
    [Required]
    [Display(Name = "Tipo de Permiso")]
    public SprfmAccion SAccionPermiso { get; set; }

    // Un objeto anidado para agrupar todos los checkboxes de permisos
    public SprfmPermisosViewModel SPermisos { get; set; } = new SprfmPermisosViewModel();


    // --- Pestaña 3: Especificaciones ---
    [MaxLength(500, ErrorMessage = "Las especificaciones no pueden exceder los 500 caracteres.")]
    public string? SEspecificaciones { get; set; }
}

// Clase anidada para organizar los checkboxes
public class SprfmPermisosViewModel
{
    public bool BDirector { get; set; }
    public bool BDirectorGeneral { get; set; }
    public bool BAdministrador { get; set; }
    public bool BAuxiliarAdministrativo { get; set; }
    public bool BResponsableProyecto { get; set; }
    public bool BResponsableControlBienes { get; set; }
    public bool BEstudiantes { get; set; }
    public bool BEventosIngreso { get; set; }
    public bool BSupervisor { get; set; }
    public bool BCajeros { get; set; }
    public bool BRevisor { get; set; }
    public bool BOtroGrupo { get; set; }
    public bool BUrAdicional { get; set; }
    public bool BPermisoEspecifico { get; set; }
    public bool BPermisoSimilar { get; set; }
}