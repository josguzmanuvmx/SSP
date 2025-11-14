﻿namespace SSP.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class VmEmpleado
{
    [Column("sId")]
    public string? SId { get; set; }
    [Column("nNoPersonal")]
    [Display(Name = "No. Personal")]
    public int NNoPersonal { get; set; }
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    [MaxLength(50, ErrorMessage = "El usuario no debe exceder 50 caracteres.")]
    [Column("sUsuario")]
    [Display(Name = "Usuario")]
    public string? SUsuario { get; set; }
    [Column("bAdmin")]
    [Display(Name = "Administrador")]
    public bool BAdmin { get; set; }
    [Column("bSiisu")]
    [Display(Name = "Permiso SIISU")]
    public bool BSiisu { get; set; }
    [Column("bSprfm")]
    [Display(Name = "Permiso SPRFM")]
    public bool BSprfm { get; set; }
    [Column("bActivo")]
    [Display(Name = "Activo")]
    public bool BActivo { get; set; }
}