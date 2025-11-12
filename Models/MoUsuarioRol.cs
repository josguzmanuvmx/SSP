using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("UsuarioRoles")]
public class MoUsuarioRol
{
    [Column("nUsrId")]
    public int NUsrId { get; set; }
    [Column("nRolId")]
    public int NRolId { get; set; }
}