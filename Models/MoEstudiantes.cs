namespace SSP.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SSP.ViewModels;

public class MoEstudiantes
{
    [Column("bActivo")]
    public bool BActivo { get; set; } = false;
}