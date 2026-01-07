namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoHumanosAdicional
{
    [Column("nNoPer")]
    public int? NNoPer { get; set; }
    [Column("sNomEmpl")]
    public string? SNomEmpl { get; set; }
    [Column("nUsrClv")]
    public int? NUsrClv { get; set; }
    [Column("sPerfil")]
    public Perfil SPerfil { get; set; } = Perfil.SAdmin;
    [Column("nDepClv")]
    public string? SDepClv { get; set; }
    [Column("SProgClv")]
    public string? SProgClv { get; set; }
    [Column("sTipPerm")]
    public Permiso STipPerm { get; set; } = Permiso.SConsult;
    [Column("sHumaMov")]
    public Movimiento SHumaMov { get; set; } = Movimiento.SAlta;
    [Column("nOrden")]
    public int? NOrden { get; set; }
}