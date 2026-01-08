namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoHumanosAdicional
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }
    [Column("nNoPer")]
    public int? NNoPer { get; set; }
    [Column("sNomEmpl")]
    public string? SNomEmpl { get; set; }
    [Column("nUsrClv")]
    public int? NUsrClv { get; set; }
    [Column("sPerfil")]
    public string? SPerfil { get; set; }
    public Perfil Perfil { get; set; } = Perfil.SAdmin;
    [Column("nDepClv")]
    public int? NDepClv { get; set; }
    [Column("SProgClv")]
    public int? NProgClv { get; set; }
    [Column("sTipPerm")]
    public string? STipPerm { get; set; }
    public Permiso TipPerm { get; set; } = Permiso.SConsult;
    [Column("sHumaMov")]
    public string? SHumaMov { get; set; }
    public Movimiento HumaMov { get; set; } = Movimiento.SAlta;
    [Column("nOrden")]
    public int? NOrden { get; set; }
}