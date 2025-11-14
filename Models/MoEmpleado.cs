namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class MoEmpleado
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }
    [Column("nNoPersonal")]
    public int NNoPersonal { get; set; }
    [Column("sUsuario")]
    public string? SUsuario { get; set; }
    [Column("bAdmin")]
    public bool BAdmin { get; set; }
    [Column("bSiisu")]
    public bool BSiisu { get; set; }
    [Column("bSprfm")]
    public bool BSprfm { get; set; }
    [Column("bActivo")]
    public bool BActivo { get; set; }
}