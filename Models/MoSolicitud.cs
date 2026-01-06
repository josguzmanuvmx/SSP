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
    public int NId { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Column("sNomEmpl")]
    public string SNomEmpl { get; set; } = "";

    [Column("nNoPer")]
    public int NNoPer { get; set; } = 0;

    [Display(Name = "Clave del usuario")]
    [Column("nUsrClv")]
    public int NUsrClv { get; set; } = 0;

    [Column("sCorreo")]
    public string SCorreo { get; set; } = "";

    [Column("nUResClv")]
    public int NUResClv { get; set; } = 0;

    [Column("sUResNom")]
    public string SUResNom { get; set; } = "";

    [Column("nRegClv")]
    public int NRegClv { get; set; } = 1;

    [Column("sRegNom")]
    public string SRegNom { get; set; } = "Xalapa";

    [Column("sPueEmpl")]
    public string SPueEmpl { get; set; } = "";

    // --- Humanos ---
    // :c
    // ---

    // --- Finanzas ---

    [Column("sFinaMov")]
    public Movimiento SFinaMov { get; set; } = Movimiento.SAlta;

    [Column("bDirec")]
    public bool BDirec { get; set; } = false;

    [Column("bDirGen")]
    public bool BDirGen { get; set; } = false;

    [Column("bAdmin")]
    public bool BAdmin { get; set; } = false;

    [Column("bAuxAdm")]
    public bool BAuxAdm { get; set; } = false;

    [Column("bResProy")]
    public bool BResProy { get; set; } = false;

    [Column("bResCB")]
    public bool BResCB { get; set; } = false;

    [Column("bEstudi")]
    public bool BEstudi { get; set; } = false;

    [Column("bEvenIng")]
    public bool BEvenIng { get; set; } = false;

    [Column("bSuper")]
    public bool BSuper { get; set; } = false;

    [Column("bCajeros")]
    public bool BCajeros { get; set; } = false;

    [Column("bRevisor")]
    public bool BRevisor { get; set; } = false;

    [Column("bOtroGru")]
    public bool BOtroGru { get; set; } = false;

    [Column("bUrAdici")]
    public bool BUrAdici { get; set; } = false;

    [Column("bPermEsp")]
    public bool BPermEsp { get; set; } = false;

    [Column("bPermSim")]
    public bool BPermSim { get; set; } = false;

    // Campos de texto detallado

    [Column("sDetaRev")]
    public string SDetaRev { get; set; } = "";

    [Column("sDetaGru")]
    public string SDetaGru { get; set; } = "";

    [Column("sDetaUrA")]
    public string SDetUrA { get; set; } = "";

    [Column("sDetaEsp")]
    public string SDetaEsp { get; set; } = "";

    [Column("sDetaSim")]
    public string SDetaSim { get; set; } = "";

    [Column("sEspeci")]
    public string SEspeci { get; set; } = "";

    // ---

    // --- Humanos ---

    [Column("nEntClv")]
    public int NEntClv { get; set; } = 0;

    [Column("sEntNomb")]
    public string SEntNomb { get; set; } = "";

    [Column("sPerfil")]
    public Perfil SPerfil { get; set; } = Perfil.SAdmin;

    [Column("nClvDep")]
    public int NClvDep { get; set; } = 0;

    [Column("sClvProg")]
    public string SClvProg { get; set; } = "";

    [Column("sTipPerm")]
    public string STipPerm { get; set; } = "";

    [Column("sHumaMov")]
    public Movimiento SHumaMov { get; set; } = Movimiento.SAlta;

    // ---

    // --- Datos Utilidad ---

    [Column("sEstatus")]
    public string SEstatus { get; set; } = "";

    [Column("dtFecCre")]
    public DateTime DtFecCre { get; set; } = DateTime.Now;

    [Column("dtUltAct")]
    public DateTime DtUltAct { get; set; } = DateTime.Now;

    [Column("bEstuAct")]
    public bool BEstuAct { get; set; } = false;

    [Column("bFinaAct")]
    public bool BFinaAct { get; set; } = false;

    [Column("bHumaAct")]
    public bool BHumaAct { get; set; } = false;

    [Column("sAutor")]
    public string SAutor { get; set; } = "";

    // ---
}