namespace SSP.Extensions;
using System.ComponentModel.DataAnnotations;
using System.Reflection;


public static class EnumExtensions
{
    // Este es el método que busca el [Display(Name="...")]
    public static string GetDisplayName(this Enum enumValue)
    {
        return enumValue.GetType()
                        .GetMember(enumValue.ToString())
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.GetName() ?? enumValue.ToString();
    }

    // Este es el método que busca el [Display(Description="...")]
    public static string GetDescription(this Enum enumValue)
    {
        return enumValue.GetType()
                        .GetMember(enumValue.ToString())
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.GetDescription() ?? string.Empty;
    }
}