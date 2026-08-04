namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public enum Movimiento
{
    [Display(Name = "Alta")]
    SAlta = 1,
    [Display(Name = "Modificación")]
    SModifi = 2,
    [Display(Name = "Baja")]
    SBaja = 3
}

public enum Perfil
{
    [Display(Name = "Titular")]
    STitular = 1,
    [Display(Name = "Administrador")]
    SAdmin = 2,
    [Display(Name = "Auxiliar de Administrador")]
    SAuxAdmin = 3,
    [Display(Name = "Operador de proceso")]
    SOpeProc = 4,
}

public enum Region
{
    [Display(Name = "1. Xalapa")]
    [ClsClaveRegion("1")]
    SXal = 1,
    [Display(Name = "2. Veracruz")]
    [ClsClaveRegion("2")]
    SVer = 2,
    [Display(Name = "3. Orizaba - Córdoba")]
    [ClsClaveRegion("3")]
    SOriCor = 3,
    [Display(Name = "4. Poza Rica - Tuxpan")]
    [ClsClaveRegion("4")]
    SPozRicT = 4,
    [Display(Name = "5. Coatzacoalcos - Minatitlan")]
    [ClsClaveRegion("5")]
    SCoatMin = 5,
}

public enum Permiso
{
    [Display(Name = "Consulta")]
    SConsult = 1,
    [Display(Name = "Mantenimiento")]
    SManteni = 2,
}

public enum Estado
{
    [Display(Name = "Pendiente")]
    SPend = 1,
    [Display(Name = "Finalizado")]
    SFinal = 2,
}

public class MoSolicitud
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }

    [Column("sFolio")]
    public string? SFolio { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Column("sNomEmpl")]
    public string? SNomEmpl { get; set; }

    [Column("nNoPer")]
    public int? NNoPer { get; set; }

    [Column("sUsuario")]
    public string? SUsuario { get; set; }

    [Column("sCorreo")]
    public string? SCorreo { get; set; }

    [Column("nUResClv")]
    public int? NUResClv { get; set; }

    [Column("nRegClv")]
    public int? NRegClv { get; set; }

    [Column("sPueEmpl")]
    public string? SPueEmpl { get; set; }

    // --- Datos Utilidad ---

    [Column("nEstado")]
    public Estado Estado { get; set; }

    [Column("dtFecCre")]
    public DateTime DtFecCre { get; set; }

    [Column("dtUltAct")]
    public DateTime DtUltAct { get; set; }

    [Column("sAutor")]
    public string? SAutor { get; set; }

    [Column("bActivo")]
    public bool BActivo { get; set; }

    // ---

    // --- Datos Diccionarios ---

    [Column("dcEstu")]
    public string? DcEstuJson { get; set; }

    [Column("dcFina")]
    public string? DcFinaJson { get; set; }

    [Column("dcHuma")]
    public string? DcHumaJson { get; set; }

    // Usado en ViewModel

    [NotMapped]
    public MoEstudiantes? MoEstudiantes { get; set; }

    [NotMapped]
    public MoFinanzas? MoFinanzas { get; set; }

    [NotMapped]
    public MoHumanos? MoHumanos { get; set; }
}