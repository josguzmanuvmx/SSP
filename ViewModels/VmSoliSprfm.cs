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
    [Display(Name = "1. Xalapa")]
    [ClsClaveRegion("1")]
    SXalapa,
    [Display(Name = "2. Veracruz")]
    [ClsClaveRegion("2")]
    SVeracruz,
    [Display(Name = "3. Orizaba - Córdoba")]
    [ClsClaveRegion("3")]
    SOrizabaCordoba,
    [Display(Name = "4. Poza Rica - Tuxpan")]
    [ClsClaveRegion("4")]
    SPozaRicaTuxpan,
    [Display(Name = "5. Coatzacoalcos - Minatitlan")]
    [ClsClaveRegion("5")]
    SCoatzacoalcosMinatitlan,
    //[Display(Name = "1. Xalapa")]
    //[ClsClaveRegion("X")]
    //SXalapaX,
    //[Display(Name = "1. Xalapa - Martínez de la Torre")]
    //[ClsClaveRegion("E")]
    //SXalapaE,
    //[Display(Name = "1. Xalapa - Totonacapan (Espinal)")]
    //[ClsClaveRegion("F")]
    //SXalapaF,
    //[Display(Name = "1. Xalapa - Grandes Montañas (Tequila)")]
    //[ClsClaveRegion("G")]
    //SXalapaG,
    //[Display(Name = "1. Xalapa - Huasteca (Ixhuatlan de Madero)")]
    //[ClsClaveRegion("H")]
    //SXalapaH,
    //[Display(Name = "1. Xalapa - Selvas (Huazuntlan)")]
    //[ClsClaveRegion("S")]
    //SXalapaS,
    //[Display(Name = "2. Veracruz")]
    //[ClsClaveRegion("V")]
    //SVeracruzV,
    //[Display(Name = "2. Veracruz - Boca del Río")]
    //[ClsClaveRegion("B")]
    //SVeracruzB,
    //[Display(Name = "3. Orizaba-Córdoba - Ciudad Mendoza")]
    //[ClsClaveRegion("M")]
    //SOrizabaCordobaM,
    //[Display(Name = "3. Orizaba-Córdoba - Nogales")]
    //[ClsClaveRegion("N")]
    //SOrizabaCordobaN,
    //[Display(Name = "3. Orizaba-Córdoba - Orizaba")]
    //[ClsClaveRegion("O")]
    //SOrizabaCordobaO,
    //[Display(Name = "3. Orizaba-Córdoba - Córdoba")]
    //[ClsClaveRegion("C")]
    //SOrizabaCordobaC,
    //[Display(Name = "3. Orizaba-Córdoba - Río Blanco")]
    //[ClsClaveRegion("L")]
    //SOrizabaCordobaL,
    //[Display(Name = "3. Orizaba-Córdoba - Peñuela Amatlan de los Reyes")]
    //[ClsClaveRegion("P")]
    //SOrizabaCordobaP,
    //[Display(Name = "4. Poza Rica-Tuxpan - Poza Rica")]
    //[ClsClaveRegion("R")]
    //SPozaRicaTuxpanR,
    //[Display(Name = "4. Poza Rica-Tuxpan - Tuxpan")]
    //[ClsClaveRegion("T")]
    //SPozaRicaTuxpanT,
    //[Display(Name = "5. Coatzacoalcos-Minatitlan - Acayucan")]
    //[ClsClaveRegion("A")]
    //SCoatzacoalcosMinatitlanA,
    //[Display(Name = "5. Coatzacoalcos-Minatitlan - Coatzacoalcos")]
    //[ClsClaveRegion("Z")]
    //SCoatzacoalcosMinatitlanZ,
    //[Display(Name = "5. Coatzacoalcos-Minatitlan - Minatitlan")]
    //[ClsClaveRegion("I")]
    //SCoatzacoalcosMinatitlanI,
    //[Display(Name = "5. Coatzacoalcos-Minatitlan - Catemaco")]
    //[ClsClaveRegion("D")]
    //SCoatzacoalcosMinatitlanD,
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
    public VmSprfmPermisos SPermisos { get; set; } = new VmSprfmPermisos();


    // --- Pestaña 3: Especificaciones ---
    [MaxLength(500, ErrorMessage = "Las especificaciones no pueden exceder los 500 caracteres.")]
    public string? SEspecificaciones { get; set; }
}