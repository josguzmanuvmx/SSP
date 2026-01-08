namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoHumanos
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }
    [Column("nEntClv")]
    public int? NEntClv { get; set; }

    [Column("sEntNomb")]
    public string? SEntNomb { get; set; }

    [Column("sPerfil")]
    public string? SPerfil { get; set; }
    public Perfil Perfil { get; set; } = Perfil.SAdmin;

    [Column("nDepClv")]
    public int? NDepClv { get; set; }

    [Column("nProgClv")]
    public int? NProgClv { get; set; }

    [Column("sTipPerm")]
    public string? STipPerm { get; set; }
    public Permiso TipPerm { get; set; } = Permiso.SConsult;

    [Column("sHumaMov")]
    public string? SHumaMov { get; set; }
    public Movimiento HumaMov { get; set; } = Movimiento.SAlta;
    [Column("lsHumaAdi")]
    public List<MoHumanosAdicional> LsHumaAdi { get; set; } = new();
    [Column("bActivo")]
    public bool BActivo { get; set; } = false;
}