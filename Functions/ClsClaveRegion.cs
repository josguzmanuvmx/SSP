using System;

// 1. Define el nuevo atributo
[AttributeUsage(AttributeTargets.Field)]
public class ClsClaveRegion : Attribute
{
    public string Codigo { get; }

    public ClsClaveRegion(string codigo)
    {
        Codigo = codigo;
    }
}