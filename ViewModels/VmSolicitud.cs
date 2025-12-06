namespace SSP.ViewModels;
using SSP.Models;
using System.ComponentModel.DataAnnotations;


public class VmSolicitud
{
    public required string SId { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Required(ErrorMessage = "El nombre del empleado es obligatorio.")]
    [Display(Name = "Nombre del empleado")]
    public string? SNomEmpl { get; set; }

    [Required(ErrorMessage = "El número de personal es obligatorio.")]
    [Display(Name = "Número de personal")]
    public int? NNoPer { get; set; }

    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo no es válido.")]
    [Display(Name = "Correo electrónico institucional")]
    public string? SCorreo { get; set; }

    [Required(ErrorMessage = "La clave de la Unidad Responsable es obligatoria.")]
    [Display(Name = "Clave de Unidad Responsable")]
    public int? NUResClv { get; set; }

    [Required(ErrorMessage = "El nombre de la Unidad Responsable es obligatorio.")]
    [Display(Name = "Nombre de Unidad Responsable")]
    public string? SUResNom { get; set; }

    [Required(ErrorMessage = "La región es obligatoria.")]
    [Display(Name = "Región")]
    public Region? SRegion { get; set; }
    
    [Required(ErrorMessage = "El puesto del empleado es obligatorio.")]
    [Display(Name = "Puesto del empleado")]
    public string? SPueEmpl { get; set; }
    public int? NUsrClv { get; set; }

    // --- Datos SPRFM ---

    [Required(ErrorMessage = "El tipo de permiso es obligatorio.")]
    [Display(Name = "Tipo de Permiso")]
    public Movimiento? SFinaMov { get; set; }

    public VmSprfmPermisos? LsPermisos { get; set; }
    [Display(Name = "Especificaciones")]
    public string? SEspeci { get; set; }


    // --- Datos SIISU ---

    [Required(ErrorMessage = "La clave de la Dependencia es obligatoria.")]
    [Display(Name = "Clave de la Dependencia")]
    public int? NEntClv { get; set; }

    [Required(ErrorMessage = "El nombre de Dependencia es obligatorio.")]
    [Display(Name = "Nombre de la Dependencia")]
    public string? SEntNomb { get; set; }
    public Perfil? SPerfil { get; set; }
    public int? NClvDep { get; set; }
    public string? SClvProg { get; set; }
    public string? STipPerm { get; set; }
    public Movimiento? SHumaMov { get; set; }

    // --- Datos Utilidad ---
    public string? SEstatus { get; set; }
    public DateTime? DtFecCre { get; set; }
    public DateTime? DtUltAct { get; set; }
    public bool BEstuAct { get; set; }
    public bool BFinaAct { get; set; }
    public bool BHumaAct { get; set; }
    public string? SAutor { get; set; }
}