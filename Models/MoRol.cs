using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Roles")]
public class MoRol
{
    [Key]
    [Column("nId")]
    public int NId { get; set; }
    [Column("sUsuario")]
    public string? SRol { get; set; }
}