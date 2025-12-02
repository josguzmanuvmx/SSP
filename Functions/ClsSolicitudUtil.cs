using System;

// 1. Define el nuevo atributo
[AttributeUsage(AttributeTargets.Field)]
public class ClsSolicitudUtil : Attribute
{
    public string Codigo { get; }

    public ClsSolicitudUtil(string codigo)
    {
        Codigo = codigo;
    }
}