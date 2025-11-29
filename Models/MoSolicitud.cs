namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using SSP.ViewModels;

public enum Movimiento
{
    [Display(Name = "Alta")]
    SAlta,
    [Display(Name = "Modificación")]
    SModificacion,
    [Display(Name = "Baja")]
    SBaja
}

public enum Perfil
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

public enum Region
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
}

public enum Permiso
{
    [Display(Name = "Consulta")]
    CConsulta,
    [Display(Name = "Mantenimiento")]
    CMantenimiento,
}

public class MoSolicitud
{
    [Key]
    public int NId { get; set; }

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
    public string? SCorreoInst { get; set; }

    [Required(ErrorMessage = "La clave de la Unidad Responsable es obligatoria.")]
    [Display(Name = "Clave de Unidad Responsable")]
    public int? NUnidadResClave { get; set; }

    [Required(ErrorMessage = "El nombre de la Unidad Responsable es obligatorio.")]
    [Display(Name = "Nombre de Unidad Responsable")]
    public string? SUnidadResNombre { get; set; }

    [Required(ErrorMessage = "La región es obligatoria.")]
    [Display(Name = "Región")]
    public Region SRegion { get; set; }
    
    [Required(ErrorMessage = "El puesto del empleado es obligatorio.")]
    [Display(Name = "Puesto del empleado")]
    public Region SPuestoEmpleado { get; set; }

    // --- Datos SPRFM ---

    [Required(ErrorMessage = "El tipo de permiso es obligatorio.")]
    [Display(Name = "Tipo de Permiso")]
    public Movimiento SMovimiento { get; set; }

    public VmSprfmPermisos? SPermisos { get; set; }


    // --- Datos SIISU ---

    [Required(ErrorMessage = "La clave de la Dependencia es obligatoria.")]
    [Display(Name = "Clave de la Dependencia")]
    public int? NEntidadClave { get; set; }

    [Required(ErrorMessage = "El nombre de Dependencia es obligatorio.")]
    [Display(Name = "Nombre de la Dependencia")]
    public string? SEntidadNombre { get; set; }
}