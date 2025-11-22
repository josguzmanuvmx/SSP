﻿namespace SSP.ViewModels;

public class ItemActividad
{
    public string? SNombre { get; set; }
    public string? SDescripcion { get; set; }
}

public class VmSprfmAct
{
    public List<ItemActividad> lsActividades { get; set; } = new List<ItemActividad>();
    public VmSoliSprfm? vmSprfm { get; set; }
}