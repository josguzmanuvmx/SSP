using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using SSP.Data;
using SSP.ViewModels;
using System.Reflection;
using Xceed.Words.NET;
using Microsoft.AspNetCore.Authorization;

[Authorize(Policy = "SiisuPolicy")]
public class SiisuController : Controller
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public SiisuController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Crear()
    {
        var vmSoliSiisu = new VmSoliSiisu();
        return View("Crear", vmSoliSiisu);
    }

    public static string GetDisplayShort(Enum enumValue)
    {
        string display = GetDisplayName(enumValue);

        if (!string.IsNullOrWhiteSpace(display))
            return display.Substring(0, 1).ToUpper();

        return "";
    }

    public static string GetDisplayName(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>()?
            .Name ?? enumValue.ToString();
    }

    [HttpPost]
    public IActionResult DescargarSolicitud(VmSoliSiisu model)
    {
        // 1. Ruta a la plantilla
        string plantilla = Path.Combine(_hostingEnvironment.WebRootPath, "templates", "siisu.xlsx");

        if (!System.IO.File.Exists(plantilla))
            return NotFound("No se encontró la plantilla siisu.xlsx en wwwroot/templates.");

        // 2. Copia temporal (para no modificar la plantilla)
        string temp = Path.Combine(Path.GetTempPath(), $"siisu_{Guid.NewGuid()}.xlsx");
        System.IO.File.Copy(plantilla, temp, true);

        // 3. Reemplazos
        var reemplazos = new Dictionary<string, string>
        {
            { "{d}", DateTime.Now.ToString("dd") },
            { "{m}", DateTime.Now.ToString("MM") },
            { "{a}", DateTime.Now.ToString("yyyy") },
            { "{entClv}", model.NEntidadClave?.ToString() ?? string.Empty },
            { "{entNombre}", model.SEntidadNombre ?? string.Empty },
            { "{noPer}", model.NNoPersonal?.ToString() ?? string.Empty },
            { "{nombre}", model.SNombre ?? string.Empty },
            { "{usuario}", model.NClvUsuario.ToString() ?? string.Empty },
            { "{perfil}", GetDisplayName(model.SPerfil) },
            { "{dependencia}", model.NClaveDependencia.ToString() ?? string.Empty },
            { "{programa}", model.NClavePrograma.ToString() ?? string.Empty },
            { "{permiso}", GetDisplayShort(model.STipoPermiso) },
            { "{movimiento}", model.STipoMovimiento ?? string.Empty },
            { "{region}", GetDisplayName(model.SRegion) },
        };

        ReemplazarPlaceholdersExcel(temp, reemplazos);

        // 4. Convertir a bytes
        byte[] bytes = System.IO.File.ReadAllBytes(temp);

        // 5. Borrar copia temporal
        System.IO.File.Delete(temp);

        string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        string nombreArchivo = $"SIISU_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

        // 6. Devolver archivo
        return File(bytes, mimeType, nombreArchivo);
    }

    // ✅ Método que reemplaza placeholders en el Excel
    private static void ReemplazarPlaceholdersExcel(string ruta, Dictionary<string, string> reemplazos)
    {
        using (SpreadsheetDocument doc = SpreadsheetDocument.Open(ruta, true))
        {
            WorkbookPart workbookPart = doc.WorkbookPart;

            foreach (WorksheetPart worksheetPart in workbookPart.WorksheetParts)
            {
                var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

                foreach (Row row in sheetData.Elements<Row>())
                {
                    foreach (Cell cell in row.Elements<Cell>())
                    {
                        string cellValue = ObtenerValorCelda(cell, workbookPart);
                        if (string.IsNullOrEmpty(cellValue)) continue;

                        foreach (var kvp in reemplazos)
                        {
                            if (cellValue.Contains(kvp.Key))
                            {
                                cellValue = cellValue.Replace(kvp.Key, kvp.Value ?? "");
                                cell.CellValue = new CellValue(cellValue);
                                cell.DataType = CellValues.String;
                            }
                        }
                    }
                }

                worksheetPart.Worksheet.Save();
            }
        }
    }

    // ✅ Lee las celdas incluyendo las SharedString
    private static string ObtenerValorCelda(Cell cell, WorkbookPart workbookPart)
    {
        if (cell == null || cell.CellValue == null)
            return "";

        string value = cell.CellValue.InnerText;

        if (cell.DataType != null && cell.DataType == CellValues.SharedString)
        {
            return workbookPart.SharedStringTablePart.SharedStringTable
                   .ChildElements[int.Parse(value)].InnerText;
        }

        return value;
    }
}