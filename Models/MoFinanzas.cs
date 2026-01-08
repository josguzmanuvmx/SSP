namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoFinanzas
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }
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
    public string? SDetaRev { get; set; }

    [Column("sDetaGru")]
    public string? SDetaGru { get; set; }

    [Column("sDetaUrA")]
    public string? SDetaUrA { get; set; }

    [Column("sDetaEsp")]
    public string? SDetaEsp { get; set; }

    [Column("sDetaSim")]
    public string? SDetaSim { get; set; }

    [Column("sEspeci")]
    public string? SEspeci { get; set; }
    [Column("bActivo")]
    public bool BActivo { get; set; } = false;
}