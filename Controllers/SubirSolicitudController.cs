using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using SSP.Data;
using SSP.ViewModels;
using Xceed.Words.NET;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

[Authorize(Policy = "SprfmPolicy")]
public class SubirSolicitudController : Controller
{
    public SubirSolicitudController()
    {
    }

    public IActionResult Index()
    {
        return View();
    }

}