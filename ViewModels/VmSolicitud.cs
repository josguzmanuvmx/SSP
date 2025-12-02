namespace SSP.ViewModels;
using SSP.Models;
using System.ComponentModel.DataAnnotations;


public class VmSolicitud
{
    public required string SId { get; set; }

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
    public string? SPuestoEmpleado { get; set; }
    public int? NUsuarioClave { get; set; }

    // --- Datos SPRFM ---

    [Required(ErrorMessage = "El tipo de permiso es obligatorio.")]
    [Display(Name = "Tipo de Permiso")]
    public Movimiento? SMovimiento { get; set; }

    public VmSprfmPermisos? LsPermisos { get; set; }
    [Display(Name = "Especificaciones")]
    public string? SEspecificaciones { get; set; }


    // --- Datos SIISU ---

    [Required(ErrorMessage = "La clave de la Dependencia es obligatoria.")]
    [Display(Name = "Clave de la Dependencia")]
    public int? NEntidadClave { get; set; }

    [Required(ErrorMessage = "El nombre de Dependencia es obligatorio.")]
    [Display(Name = "Nombre de la Dependencia")]
    public string? SEntidadNombre { get; set; }
    public Perfil? SPerfil { get; set; }
    public int? NClaveDependencia { get; set; }
    public string? SClavePrograma { get; set; }
    public string? STipoPermiso { get; set; }
    public Movimiento? STipoMovimiento { get; set; }

    public string? SAccionPermiso { get; set; }
}