namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoHumanos
{
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
    [Column("lsHumaAdi")]
    public List<MoHumanosAdicional> LsHumaAdi { get; set; } = new();
    [Column("bActivo")]
    public bool BActivo { get; set; } = false;
}