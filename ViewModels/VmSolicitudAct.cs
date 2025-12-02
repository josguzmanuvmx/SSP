﻿namespace SSP.ViewModels;

public class ClslActividades
{
    public string? SNombre { get; set; }
    public string? SDescripcion { get; set; }
}

public class VmSolicitudAct
{
    public List<ClslActividades> lsActividades { get; set; } = new List<ClslActividades>();
    public VmSolicitud? vmSolicitud { get; set; }
}