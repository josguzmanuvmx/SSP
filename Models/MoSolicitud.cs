namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public enum Movimiento
{
    [Display(Name = "Alta")]
    SAlta,
    [Display(Name = "Modificación")]
    SModifi,
    [Display(Name = "Baja")]
    SBaja
}

public enum Perfil
{
    [Display(Name = "Titular")]
    STitular,
    [Display(Name = "Administrador")]
    SAdmin,
    [Display(Name = "Auxiliar de Administrador")]
    SAuxAdmin,
    [Display(Name = "Operador de proceso")]
    SOpeProc,
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
    SConsult,
    [Display(Name = "Mantenimiento")]
    SManteni,
}

public enum Estatus
{
    [Display(Name = "Finalizado")]
    SFinal = 1,
    [Display(Name = "Pendiente")]
    SPend = 2,
}

public class MoSolicitud
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Column("sNomEmpl")]
    public string? SNomEmpl { get; set; }

    [Column("nNoPer")]
    public int? NNoPer { get; set; }

    [Column("nUsrClv")]
    public int? NUsrClv { get; set; }

    [Column("sCorreo")]
    public string? SCorreo { get; set; }

    [Column("nUResClv")]
    public int? NUResClv { get; set; }

    [Column("sUResNom")]
    public string? SUResNom { get; set; }

    [Column("nRegClv")]
    public int? NRegClv { get; set; }

    [Column("sPueEmpl")]
    public string? SPueEmpl { get; set; }

    // --- Datos Diccionarios ---

    [Column("dcPermFina")]
    public MoFinanzas MoFinanzas { get; set; } = new();

    [Column("dcPermHuma")]
    public MoHumanos MoHumanos { get; set; } = new();

    [Column("dcPermEstu")]
    public MoEstudiantes MoEstudiantes { get; set; } = new();

    // --- Datos Utilidad ---

    [Column("nEstatus")]
    public int? nEstatus { get; set; }

    [Column("dtFecCre")]
    public DateTime DtFecCre { get; set; } = DateTime.Now;

    [Column("dtUltAct")]
    public DateTime DtUltAct { get; set; } = DateTime.Now;

    [Column("sAutor")]
    public string? SAutor { get; set; }

    // ---
}