using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Linq.Expressions;

// Usamos este namespace para que las vistas lo reconozcan automáticamente
// sin necesidad de agregar muchos 'using' extras.
namespace Microsoft.AspNetCore.Mvc.Rendering
{
    public static class HtmlExtensions
    {
        /// <summary>
        /// Recupera el valor de la propiedad 'Description' del atributo [Display] de un modelo.
        /// </summary>
        /// <param name="html">El helper HTML actual.</param>
        /// <param name="expression">La expresión lambda que apunta a la propiedad (ej. m => m.BDirector).</param>
        /// <returns>El texto de la descripción o una cadena vacía.</returns>
        public static string DescriptionFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression)
        {
            // 1. Obtenemos el servicio que sabe analizar expresiones de modelos en ASP.NET Core
            var expressionProvider = (ModelExpressionProvider)html.ViewContext.HttpContext
                .RequestServices.GetService(typeof(IModelExpressionProvider));

            if (expressionProvider == null) return string.Empty;

            // 2. Analizamos la expresión (m => m.Propiedad) para obtener sus metadatos
            var modelExpression = expressionProvider.CreateModelExpression(html.ViewData, expression);

            // 3. Devolvemos la descripción. Si es nula, devolvemos vacío.
            return modelExpression.Metadata.Description ?? "";
        }
    }
}