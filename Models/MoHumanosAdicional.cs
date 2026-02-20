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
    [Column("sUsuario")]
    public string? SUsuario { get; set; }
    [Column("nPerfil")]
    public Perfil Perfil { get; set; } = Perfil.SAdmin;
    [Column("nDepClv")]
    public int? NDepClv { get; set; }
    [Column("nProgClv")]
    public int? NProgClv { get; set; }
    [Column("nPermiso")]
    public Permiso Permiso { get; set; } = Permiso.SConsult;
    [Column("nMovimiento")]
    public Movimiento Movimiento { get; set; } = Movimiento.SAlta;
    [Column("nOrden")]
    public int? NOrden { get; set; }
}