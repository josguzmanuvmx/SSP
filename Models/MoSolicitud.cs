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
    SXal,
    [Display(Name = "2. Veracruz")]
    [ClsClaveRegion("2")]
    SVer,
    [Display(Name = "3. Orizaba - Córdoba")]
    [ClsClaveRegion("3")]
    SOriCor,
    [Display(Name = "4. Poza Rica - Tuxpan")]
    [ClsClaveRegion("4")]
    SPozRicT,
    [Display(Name = "5. Coatzacoalcos - Minatitlan")]
    [ClsClaveRegion("5")]
    SCoatMin,
}

public enum Permiso
{
    [Display(Name = "Consulta")]
    SConsult,
    [Display(Name = "Mantenimiento")]
    SManteni,
}

public class MoSolicitud
{
    [Key]
    [Column("nId")]
    public required int NId { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Column("sNomEmpl")]
    public required string SNomEmpl { get; set; }

    [Column("nNoPer")]
    public required int NNoPer { get; set; }

    [Display(Name = "Clave del usuario")]
    [Column("nUsrClv")]
    public required int NUsrClv { get; set; }

    [Column("sCorreo")]
    public required string SCorreo { get; set; }

    [Column("nUResClv")]
    public required int NUResClv { get; set; }

    [Column("sUResNom")]
    public required string SUResNom { get; set; }

    [Column("nRegClv")]
    public required int NRegClv { get; set; }

    [Column("sRegNom")]
    public required string SRegNom { get; set; }

    [Column("sPueEmpl")]
    public required string SPueEmpl { get; set; }

    // --- Humanos ---
    // :c
    // ---

    // --- Finanzas ---

    [Column("sFinaMov")]
    public Movimiento? SFinaMov { get; set; }

    [Column("bDirec")]
    public bool BDirec { get; set; }

    [Column("bDirGen")]
    public bool BDirGen { get; set; }

    [Column("bAdmin")]
    public bool BAdmin { get; set; }

    [Column("bAuxAdm")]
    public bool BAuxAdm { get; set; }

    [Column("bResProy")]
    public bool BResProy { get; set; }

    [Column("bResCB")]
    public bool BResCB { get; set; }

    [Column("bEstudi")]
    public bool BEstudi { get; set; }

    [Column("bEvenIng")]
    public bool BEvenIng { get; set; }

    [Column("bSuper")]
    public bool BSuper { get; set; }

    [Column("bCajeros")]
    public bool BCajeros { get; set; }

    [Column("bRevisor")]
    public bool BRevisor { get; set; }

    [Column("bOtroGru")]
    public bool BOtroGru { get; set; }

    [Column("bUrAdici")]
    public bool BUrAdici { get; set; }

    [Column("bPermEsp")]
    public bool BPermEsp { get; set; }

    [Column("bPermSim")]
    public bool BPermSim { get; set; }

    // Campos de texto detallado
    
    [Column("sDetaRev")]
    public string? SDetaRev { get; set; }

    [Column("sDetaGru")]
    public string? SDetaGru { get; set; }

    [Column("sDetaUrA")]
    public string? SDetUrA { get; set; }

    [Column("sDetaEsp")]
    public string? SDetaEsp { get; set; }

    [Column("sDetaSim")]
    public string? SDetaSim { get; set; }

    [Column("sEspeci")]
    public string? SEspeci { get; set; }

    // ---

    // --- Humanos ---

    [Column("nEntClv")]
    public int? NEntClv { get; set; }

    [Column("sEntNomb")]
    public string? SEntNomb { get; set; }

    [Column("sPerfil")]
    public Perfil? SPerfil { get; set; }

    [Column("nClvDep")]
    public int? NClvDep { get; set; }

    [Column("sClvProg")]
    public string? SClvProg { get; set; }

    [Column("sTipPerm")]
    public string? STipPerm { get; set; }

    [Column("sHumaMov")]
    public Movimiento? SHumaMov { get; set; }

    // ---

    // --- Datos Utilidad ---

    [Column("sEstatus")]
    public string? SEstatus { get; set; }

    [Column("dtFecCre")]
    public DateTime? DtFecCre { get; set; }

    [Column("dtUltAct")]
    public DateTime? DtUltAct { get; set; }

    [Column("bEstuAct")]
    public bool BEstuAct { get; set; }

    [Column("bFinaAct")]
    public bool BFinaAct { get; set; }

    [Column("bHumaAct")]
    public bool BHumaAct { get; set; }

    [Column("sAutor")]
    public string? SAutor { get; set; }

    // ---
}