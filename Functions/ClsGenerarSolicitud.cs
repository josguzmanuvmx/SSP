namespace SSP.Functions;

using SSP.Data;
using SSP.Models;
using SSP.ViewModels;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIORenderer;
using Syncfusion.Pdf;
using Syncfusion.XlsIO;
using Syncfusion.XlsIORenderer;
using System.Reflection;
using Xceed.Words.NET;

public class ClsGenerarSolicitud
{
    private readonly IWebHostEnvironment _env;

    public ClsGenerarSolicitud(IWebHostEnvironment env)
    {
        _env = env;
    }

    public byte[] GenerarPDF_SIISU(VmSolicitud vmSolicitud)
    {
        MemoryStream ms = new MemoryStream();
        return ms.ToArray();
    }

    public static string GetDisplayName(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>()?
            .Name ?? enumValue.ToString();
    }

    public static string GetCodigoRegion(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<ClsClaveRegion>()
            ?.Codigo ?? string.Empty;
    }

    public static string GetNombreSinNumero(Enum enumValue)
    {
        string nombreCompleto = GetDisplayName(enumValue);
        int indicePunto = nombreCompleto.IndexOf('.');
        if (indicePunto >= 0)
        {
            return nombreCompleto.Substring(indicePunto + 1).Trim();
        }
        return nombreCompleto;
    }

    public byte[] GenerarPDF_FINANZAS(VmSolicitud vmSolicitud)
    {
        string plantillaPath = Path.Combine(_env.WebRootPath, "templates", "sprfm.docx");

        using (FileStream fileStream = new FileStream(plantillaPath, FileMode.Open, FileAccess.Read))
        {
            using (WordDocument doc = new WordDocument(fileStream, FormatType.Docx))
            {
                doc.Replace("{d}", DateTime.Now.ToString("dd"), true, true);
                doc.Replace("{m}", DateTime.Now.ToString("MM"), true, true);
                doc.Replace("{a}", DateTime.Now.ToString("yyyy"), true, true);

                doc.Replace("{nombreEmpleado}", vmSolicitud.SNomEmpl ?? "", true, true);
                doc.Replace("{noPersonal}", vmSolicitud.NNoPer.ToString() ?? "", true, true);
                doc.Replace("{correoInst}", vmSolicitud.SCorreo ?? "", true, true);
                doc.Replace("{uRC}", vmSolicitud.NUResClv.ToString() ?? "", true, true);
                doc.Replace("{uRN}", vmSolicitud.SUResNom ?? "", true, true);
                doc.Replace("{rC}", GetCodigoRegion(vmSolicitud.SRegion), true, true);
                doc.Replace("{rN}", GetNombreSinNumero(vmSolicitud.SRegion), true, true);
                doc.Replace("{puestoEmpleado}", vmSolicitud.SPueEmpl ?? "", true, true);

                TextSelection selection = doc.Find("{especificaciones}", false, false);
                if (selection != null)
                {
                    WParagraph paragraph = selection.GetAsOneRange().OwnerParagraph;
                    paragraph.ChildEntities.Clear();

                    void AgregarLineaConEstilo(string titulo, string valor)
                    {
                        // Parte A: El Título (Negrita)
                        IWTextRange rangoTitulo = paragraph.AppendText(titulo);
                        rangoTitulo.CharacterFormat.Bold = true;

                        // Parte B: El Valor (Normal) + \n para el salto de línea
                        IWTextRange rangoValor = paragraph.AppendText(valor + "\n");
                        rangoValor.CharacterFormat.Bold = false;
                    }

                    // --- A. REVISOR (Mezclado: Negrita + Normal) ---
                    if (vmSolicitud.BRevisor && !string.IsNullOrWhiteSpace(vmSolicitud.SDetaRev))
                    {
                        AgregarLineaConEstilo("REVISOR: ", vmSolicitud.SDetaRev);
                    }

                    // --- B. OTRO GRUPO ---
                    if (vmSolicitud.BOtroGru && !string.IsNullOrWhiteSpace(vmSolicitud.SDetaGru))
                    {
                        AgregarLineaConEstilo("OTRO GRUPO: ", vmSolicitud.SDetaGru);
                    }

                    // --- C. UR ADICIONAL ---
                    if (vmSolicitud.BUrAdici && !string.IsNullOrWhiteSpace(vmSolicitud.SDetUrA))
                    {
                        AgregarLineaConEstilo("UR adicional: ", vmSolicitud.SDetUrA);
                    }

                    // --- D. PERMISO ESPECÍFICO ---
                    if (vmSolicitud.BPermEsp && !string.IsNullOrWhiteSpace(vmSolicitud.SDetaEsp))
                    {
                        AgregarLineaConEstilo("Permiso específico: ", vmSolicitud.SDetaEsp);
                    }

                    // --- E. PERMISO SIMILAR ---
                    if (vmSolicitud.BPermSim && !string.IsNullOrWhiteSpace(vmSolicitud.SDetaSim))
                    {
                        AgregarLineaConEstilo("Permisos similares a: ", vmSolicitud.SDetaSim);
                    }
                }
                else
                {
                    doc.Replace("{especificaciones}", "", true, true);
                }

                void ReemplazarCheck(string marcador, bool marcado)
                {
                    TextSelection sel = doc.Find(marcador, false, false);
                    if (sel != null)
                    {
                        WTextRange range = sel.GetAsOneRange();
                        range.Text = marcado ? "☒" : "☐";
                        range.CharacterFormat.FontName = "Segoe UI Symbol";
                        range.CharacterFormat.FontSize = 11;
                    }
                }

                ReemplazarCheck("{alta}", vmSolicitud.SFinaMov == Movimiento.SAlta);
                ReemplazarCheck("{modificacion}", vmSolicitud.SFinaMov == Movimiento.SModifi);
                ReemplazarCheck("{baja}", vmSolicitud.SFinaMov == Movimiento.SBaja);

                doc.Replace("{director}", vmSolicitud.BDirec ? "x" : "", true, true);
                doc.Replace("{dirGen}", vmSolicitud.BDirGen ? "x" : "", true, true);
                doc.Replace("{admin}", vmSolicitud.BAdmin ? "x" : "", true, true);
                doc.Replace("{auxAdmin}", vmSolicitud.BAuxAdm ? "x" : "", true, true);
                doc.Replace("{resProy}", vmSolicitud.BResProy ? "x" : "", true, true);
                doc.Replace("{resCB}", vmSolicitud.BResCB ? "x" : "", true, true);
                doc.Replace("{estudi}", vmSolicitud.BEstudi ? "x" : "", true, true);
                doc.Replace("{eveIng}", vmSolicitud.BEvenIng ? "x" : "", true, true);
                doc.Replace("{super}", vmSolicitud.BSuper ? "x" : "", true, true);
                doc.Replace("{cajeros}", vmSolicitud.BCajeros ? "x" : "", true, true);
                doc.Replace("{revisor}", vmSolicitud.BRevisor ? "x" : "", true, true);
                doc.Replace("{otroGrupo}", vmSolicitud.BOtroGru ? "x" : "", true, true);
                doc.Replace("{urAdic}", vmSolicitud.BUrAdici ? "x" : "", true, true);
                doc.Replace("{permEsp}", vmSolicitud.BPermEsp ? "x" : "", true, true);
                doc.Replace("{asigPerm}", vmSolicitud.BPermSim ? "x" : "", true, true);

                // ============================================
                // D. CONVERSIÓN A PDF
                // ============================================
                using (DocIORenderer render = new DocIORenderer())
                {
                    using (PdfDocument pdfDocument = render.ConvertToPDF(doc))
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            pdfDocument.Save(ms);
                            return ms.ToArray();
                        }
                    }
                }
            }
        }
    }

    public byte[] GenerarPDF_HUMANOS(VmSolicitud solicitud)
    {
        string plantillaPath = Path.Combine(_env.WebRootPath, "templates", "siisu.xlsx");

        using (ExcelEngine excelEngine = new ExcelEngine())
        {
            IApplication application = excelEngine.Excel;
            application.DefaultVersion = ExcelVersion.Excel2016;

            using (FileStream fileStream = new FileStream(plantillaPath, FileMode.Open, FileAccess.Read))
            {
                IWorkbook workbook = application.Workbooks.Open(fileStream);
                IWorksheet sheet = workbook.Worksheets[0];

                // =========================================================================
                // 1. UNIFICAR USUARIOS (Principal + Adicionales) EN UNA SOLA LISTA
                // =========================================================================
                var listaTotal = new List<VmUsuarioAdicional>();

                // 1.1 Convertir Usuario Principal a la estructura genérica
                // Nota: Aquí convertimos tus Enums del principal a Strings para igualar a los adicionales
                

                listaTotal.Add(new VmUsuarioAdicional
                {
                    NNoPer = solicitud.NNoPer,
                    SNomEmpl = solicitud.SNomEmpl,
                    NUsrClv = solicitud.NUsrClv,
                    SPerfil = solicitud.SPerfil,
                    NClvDep = solicitud.NClvDep,
                    SClvProg = solicitud.SClvProg,
                    STipPerm = solicitud.STipPerm,
                    SHumaMov = solicitud.SHumaMov
                });

                // 1.2 Agregar Adicionales (Si existen)
                if (solicitud.LsUsuariosAdicionales != null && solicitud.LsUsuariosAdicionales.Count > 0)
                {
                    listaTotal.AddRange(solicitud.LsUsuariosAdicionales);
                }

                // 1.3 APLICAR REGLA: MÁXIMO 10 USUARIOS
                if (listaTotal.Count > 10)
                {
                    listaTotal = listaTotal.Take(10).ToList();
                }

                // =========================================================================
                // 2. PREPARAR LA TABLA EN EXCEL (Clonar filas)
                // =========================================================================

                // Buscamos la fila "Plantilla" usando un marcador único, ej: {noPer}
                var celdaBase = sheet.FindFirst("{noPer}", ExcelFindType.Text, ExcelFindOptions.None);

                if (celdaBase != null)
                {
                    int filaInicio = celdaBase.Row; // El número de fila donde están los marcadores
                    int totalUsuarios = listaTotal.Count;
                    int filasPorDefecto = 6; // El formato ya trae 6 espacios

                    // Si hay más de 1 usuario, necesitamos crear espacio
                    if (totalUsuarios > 1)
                    {
                        // Iteramos desde el 2do usuario (índice 1)
                        for (int i = 1; i < totalUsuarios; i++)
                        {
                            int filaDestino = filaInicio + i;

                            // REGLA: Si superamos las 6 filas por defecto, INSERTAMOS nueva fila
                            // (Si i=1..5, usamos las filas vacías que ya existen. Si i>=6, insertamos)
                            if (i >= filasPorDefecto)
                            {
                                sheet.InsertRow(filaDestino);
                            }

                            // COPIAMOS el diseño/marcadores de la fila 1 a la fila destino
                            // (Esto sobreescribe la fila vacía existente con los marcadores {noPer}...)
                            IRange origen = sheet.Range[filaInicio, 1, filaInicio, sheet.UsedRange.LastColumn];
                            IRange destino = sheet.Range[filaDestino, 1, filaDestino, sheet.UsedRange.LastColumn];

                            origen.CopyTo(destino);
                            sheet.Rows[filaDestino - 1].RowHeight = sheet.Rows[filaInicio - 1].RowHeight;
                        }
                    }

                    // =========================================================================
                    // 3. RELLENAR DATOS FILA POR FILA
                    // =========================================================================
                    for (int i = 0; i < totalUsuarios; i++)
                    {
                        var usuario = listaTotal[i];
                        int filaActual = filaInicio + i;

                        string sPermiso;
                        switch (usuario.STipPerm)
                        {
                            case Permiso.SConsult:
                                sPermiso = "C";
                                break;
                            case Permiso.SManteni:
                                sPermiso = "M";
                                break;
                            default:
                                sPermiso = "";
                                break;
                        }

                        string sMovimiento;
                        switch (usuario.SHumaMov)
                        {
                            case Movimiento.SAlta:
                                sMovimiento = "A";
                                break;
                            case Movimiento.SModifi:
                                sMovimiento = "M";
                                break;
                            case Movimiento.SBaja:
                                sMovimiento = "B";
                                break;
                            default:
                                sMovimiento = "";
                                break;
                        }

                        // FUNCIÓN LOCAL: Reemplaza SOLO en la fila actual
                        void ReemplazarEnFila(string marcador, string valor)
                        {
                            // Definimos el rango de SOLO esta fila
                            IRange rangoFila = sheet.Range[filaActual, 1, filaActual, sheet.UsedRange.LastColumn];
                            rangoFila.Replace(marcador, valor ?? "", ExcelFindOptions.None);
                        }

                        // Ejecutar reemplazos para este usuario específico
                        ReemplazarEnFila("{noPer}", usuario.NNoPer?.ToString());
                        ReemplazarEnFila("{nombre}", usuario.SNomEmpl);
                        ReemplazarEnFila("{usuario}", usuario.NUsrClv.ToString());
                        // Si el perfil necesita conversión, hazlo aquí:
                        ReemplazarEnFila("{perfil}", GetDisplayName(usuario.SPerfil) ?? "");
                        ReemplazarEnFila("{dependencia}", usuario.NClvDep?.ToString());
                        ReemplazarEnFila("{programa}", usuario.SClvProg);
                        ReemplazarEnFila("{permiso}", sPermiso);
                        ReemplazarEnFila("{movimiento}", sMovimiento);
                    }
                }

                // =========================================================================
                // 4. DATOS GLOBALES (Encabezados y Fechas)
                // =========================================================================
                // Estos se reemplazan en todo el documento (headers, footers, fechas)
                sheet.Replace("{d}", DateTime.Now.ToString("dd"), ExcelFindOptions.None);
                sheet.Replace("{m}", DateTime.Now.ToString("MM"), ExcelFindOptions.None);
                sheet.Replace("{a}", DateTime.Now.ToString("yyyy"), ExcelFindOptions.None);

                sheet.Replace("{entClv}", solicitud.NEntClv.ToString() ?? "", ExcelFindOptions.None);
                sheet.Replace("{entNombre}", solicitud.SEntNomb ?? "", ExcelFindOptions.None);
                // Asumiendo que tienes GetNombreSinNumero disponible
                // sheet.Replace("{region}", GetNombreSinNumero(solicitud.SRegion), ExcelFindOptions.None);
                sheet.Replace("{region}", GetNombreSinNumero(solicitud.SRegion)); // Temporal si no tienes el helper

                // =========================================================================
                // 5. CONFIGURACIÓN DE PÁGINA Y PDF
                // =========================================================================
                sheet.PageSetup.TopMargin = 0.0;
                sheet.PageSetup.BottomMargin = 0.0;
                sheet.PageSetup.LeftMargin = 0.6;
                sheet.PageSetup.RightMargin = 0.6;
                sheet.PageSetup.CenterHorizontally = true;
                sheet.PageSetup.CenterVertically = true;

                XlsIORenderer renderer = new XlsIORenderer();
                XlsIORendererSettings settings = new XlsIORendererSettings();

                // Ajustar columnas a una página es vital para tablas dinámicas
                settings.LayoutOptions = LayoutOptions.FitAllColumnsOnOnePage;

                using (PdfDocument pdfDocument = renderer.ConvertToPDF(workbook, settings))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        pdfDocument.Save(ms);
                        return ms.ToArray();
                    }
                }
            }
        }
    }

    public byte[] GenerarPDF_HUMANOS2(VmSolicitud solicitud)
    {
        string plantillaPath = Path.Combine(_env.WebRootPath, "templates", "siisu.xlsx");

        using (ExcelEngine excelEngine = new ExcelEngine())
        {
            IApplication application = excelEngine.Excel;
            application.DefaultVersion = ExcelVersion.Excel2016;

            string sPermiso;
            switch (solicitud.STipPerm)
            {
                case Permiso.SConsult:
                    sPermiso = "C";
                    break;
                case Permiso.SManteni:
                    sPermiso = "M";
                    break;
                default:
                    sPermiso = "";
                    break;
            }

            string sMovimiento;
            switch (solicitud.SFinaMov)
            {
                case Movimiento.SAlta:
                    sMovimiento = "A";
                    break;
                case Movimiento.SModifi:
                    sMovimiento = "M";
                    break;
                case Movimiento.SBaja:
                    sMovimiento = "B";
                    break;
                default:
                    sMovimiento = "";
                    break;
            }


            // Abrimos el archivo
            using (FileStream fileStream = new FileStream(plantillaPath, FileMode.Open, FileAccess.Read))
            {
                IWorkbook workbook = application.Workbooks.Open(fileStream);
                IWorksheet sheet = workbook.Worksheets[0];

                void Reemplazar(string marcador, string valor)
                {
                    sheet.Replace(marcador, valor ?? "", ExcelFindOptions.None);
                }

                Reemplazar("{d}", DateTime.Now.ToString("dd"));
                Reemplazar("{m}", DateTime.Now.ToString("MM"));
                Reemplazar("{a}", DateTime.Now.ToString("yyyy"));

                Reemplazar("{entClv}", solicitud.NEntClv.ToString() ?? "");
                Reemplazar("{entNombre}", solicitud.SEntNomb ?? "");


                Reemplazar("{noPer}", solicitud.NNoPer.ToString() ?? "");
                Reemplazar("{nombre}", solicitud.SNomEmpl ?? "");
                Reemplazar("{usuario}", solicitud.NUsrClv.ToString() ?? "");
                Reemplazar("{perfil}", GetDisplayName(solicitud.SPerfil) ?? "");
                Reemplazar("{dependencia}", solicitud.NClvDep.ToString() ?? "");
                Reemplazar("{programa}", solicitud.SClvProg ?? "");
                Reemplazar("{permiso}", sPermiso);
                Reemplazar("{movimiento}", sMovimiento);
                Reemplazar("{region}", GetNombreSinNumero(solicitud.SRegion));

                sheet.PageSetup.TopMargin = 0.5;     // Superior
                sheet.PageSetup.BottomMargin = 0.5;  // Inferior
                sheet.PageSetup.LeftMargin = 0.6;    // Izquierdo (Estrecho para que quepa más)
                sheet.PageSetup.RightMargin = 0.6;   // Derecho

                // Opcional: Centrar contenido horizontalmente en la página
                sheet.PageSetup.CenterHorizontally = true;

                XlsIORenderer renderer = new XlsIORenderer();
                XlsIORendererSettings settings = new XlsIORendererSettings();

                // TRUCO PRO: Ajustar todas las columnas en una sola página
                // Esto evita que el Excel se parta a la mitad si es muy ancho
                settings.LayoutOptions = LayoutOptions.FitAllColumnsOnOnePage;

                using (PdfDocument pdfDocument = renderer.ConvertToPDF(workbook, settings))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        pdfDocument.Save(ms);
                        return ms.ToArray();
                    }
                }
            }
        }
    }
}