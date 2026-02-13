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
    public ClsCatalogoDependencias Dependencia
    {
        get
        {
            // Lógica de lectura segura (la que ya tenías)
            return NEntClv.HasValue && Enum.IsDefined(typeof(ClsCatalogoDependencias), NEntClv.Value)
                ? (ClsCatalogoDependencias)NEntClv.Value
                : ClsCatalogoDependencias.D11101;
        }
        set
        {
            // Lógica de escritura: Cuando el usuario selecciona en el dropdown,
            // guardamos el número entero en la propiedad real de la BD.
            NEntClv = (int)value;
        }
    }

    [Column("nPerfil")]
    public Perfil Perfil { get; set; } = Perfil.SAdmin;

    [Column("nDepClv")]
    public int? NDepClv { get; set; }

    [Column("nProgClv")]
    public int? NProgClv { get; set; }

    [Column("nTipPerm")]
    public Permiso Permiso { get; set; } = Permiso.SConsult;

    [Column("nHumaMov")]
    public Movimiento Movimiento { get; set; } = Movimiento.SAlta;
    [Column("lsHumaAdi")]
    public List<MoHumanosAdicional> LsHumaAdi { get; set; } = new();
    [Column("bActivo")]
    public bool BActivo { get; set; } = false;
}