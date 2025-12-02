namespace SSP.ViewModels;
using System.ComponentModel.DataAnnotations;
public enum SiisuMovimiento
{
    SAlta,
    SModificacion,
    SBaja
}

public enum SiisuPerfil
{
    [Display(Name = "Titular")]
    STitular,
    [Display(Name = "Administrador")]
    SAdministrador,
    [Display(Name = "Auxiliar de Administrador")]
    SAuxiliarAdministrador,
    [Display(Name = "Operador de proceso")]
    SOperadorProceso
}

public enum SiisuRegion
{
    [Display(Name = "Xalapa")]
    SXalapa,
    [Display(Name = "Veracruz")]
    SVeracruz,
    [Display(Name = "Orizaba - Córdoba")]
    SOrizabaCordoba,
    [Display(Name = "Poza Rica - Tuxpan")]
    SPozaRicaTuxpan,
    [Display(Name = "Coatzacoalcos - Minatitlan")]
    SCoatzacoalcosMinatitlan
}

public enum SiisuPermiso
{
    [Display(Name = "Consulta")]
    CConsulta,
    [Display(Name = "Mantenimiento")]
    CMantenimiento,
}

public class VmSoliSiisu
{
    // --- Pestaña 1: Entidad Académica o Dependencia---
    [Required(ErrorMessage = "La clave de la Dependencia es obligatoria.")]
    [Display(Name = "Clave de la Dependencia")]
    public int? NEntidadClave { get; set; }
    [Required(ErrorMessage = "El nombre de Dependencia es obligatorio.")]
    [Display(Name = "Nombre de la Dependencia")]
    public string? SEntidadNombre { get; set; }

    // --- Pestaña 2: Empleado autorizado ---
    [Required(ErrorMessage = "El número de personal es obligatorio.")]
    [Display(Name = "Número de personal")]
    public int? NNoPersonal { get; set; }

    [Required(ErrorMessage = "El nombre del empleado es obligatorio.")]
    [Display(Name = "Nombre del empleado")]
    public string? SNombre { get; set; }

    [Required(ErrorMessage = "La clave del usuario es obligatoria.")]
    [Display(Name = "Clave del usuario")]
    public int? NClvUsuario { get; set; }

    [Required]
    [Display(Name = "Actividad Institucional")]
    public SiisuPerfil SPerfil { get; set; }

    // --- Pestaña 3: Permisos ---

    [Required(ErrorMessage = "La clave de la dependencia es obligatoria.")]
    [Display(Name = "Clave Dependencia")]
    public int? NClaveDependencia { get; set; }

    [Required(ErrorMessage = "La clave del programa es obligatoria.")]
    [Display(Name = "Clave de Programa")]
    public int? NClavePrograma { get; set; }


    [Required(ErrorMessage = "El nombre de la Unidad Responsable es obligatorio.")]
    [Display(Name = "Tipo de Permiso")]
    public SiisuPermiso STipoPermiso { get; set; }

    [Required(ErrorMessage = "La clave de la Región es obligatoria.")]
    [Display(Name = "Clave de Región")]
    public string? STipoMovimiento { get; set; }

    [Required(ErrorMessage = "La clave de la Región es obligatoria.")]
    [Display(Name = "Clave de Región")]
    public SiisuRegion SRegion { get; set; }

    public SiisuMovimiento SAccionPermiso { get; set; }
}