namespace SSP.ViewModels;
using SSP.Models;
using System.ComponentModel.DataAnnotations;


public class VmUsuarioAdicional
{
    public int? NNoPer { get; set; }
    public string? SNomEmpl { get; set; }
    public int? NUsrClv { get; set; }
    public Perfil SPerfil { get; set; } = Perfil.SAdmin;
    public int? NClvDep { get; set; }
    public string? SClvProg { get; set; }
    public Permiso STipPerm { get; set; } = Permiso.SConsult;
    public Movimiento SHumaMov { get; set; } = Movimiento.SAlta;
}

public class VmSolicitud
{
    public string? SId { get; set; }

    // --- Pestaña 1: Datos del Usuario ---

    [Required(ErrorMessage = "El nombre del empleado es obligatorio.")]
    [Display(Name = "Nombre del empleado")]
    public string? SNomEmpl { get; set; }

    [Required(ErrorMessage = "El número de personal es obligatorio.")]
    [Display(Name = "Número de personal")]
    public int? NNoPer { get; set; }

    [Display(Name = "Clave del usuario")]
    public int? NUsrClv { get; set; }

    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo no es válido.")]
    [Display(Name = "Correo electrónico institucional")]
    public string? SCorreo { get; set; }

    [Required(ErrorMessage = "La clave de la Unidad Responsable es obligatoria.")]
    [Display(Name = "Clave de Unidad Responsable")]
    public int? NUResClv { get; set; }

    [Required(ErrorMessage = "El nombre de la Unidad Responsable es obligatorio.")]
    [Display(Name = "Nombre de Unidad Responsable")]
    public string? SUResNom { get; set; }

    [Required(ErrorMessage = "La clave de región es obligatoria.")]
    [Display(Name = "Clave de la Región")]
    public int? NRegClv { get; set; }

    [Required(ErrorMessage = "El nombre de región es obligatorio.")]
    [Display(Name = "Nombre de la Región")]
    public string? SRegNom { get; set; }

    public Region SRegion { get; set; } = Region.SXal;

    [Required(ErrorMessage = "El puesto del empleado es obligatorio.")]
    [Display(Name = "Puesto del empleado")]
    public string? SPueEmpl { get; set; }

    // --- Humanos ---
    // :c
    // ---

    // --- Finanzas ---

    [Required(ErrorMessage = "El tipo de permiso es obligatorio.")]
    [Display(Name = "Tipo de Permiso")]
    public Movimiento SFinaMov { get; set; } = Movimiento.SAlta;

    [Display(
        Name = "DIRECTOR (Director de UR)",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>DIRECTOR</span> <i>(Director de UR).</i> Usuario identificado como el Titular / Director / Responsable / Encargado de la UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Registro y consulta de anteproyectos y proyectos de PBR.</li>" +
                      "<li>Registro y consulta de requerimientos presupuestales.</li>" +
                      "<li>Registro de avance programático y seguimiento de proyectos de PBR.</li>" +
                      "<li>Registro y consulta de trámites de la DRM (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Consulta de trámites de la DE y DSG (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Revisión y autorización de trámites de egresos (solicitud del egreso y egreso según corresponda).</li>" +
                      "<li>Carga de Facturas (XML).</li>" +
                      "<li>Recepción de mercancía interna.</li>" +
                      "<li>Consulta del catálogo de claves presupuestarias.</li>" +
                      "<li>Consulta la disponibilidad financiera.</li>" +
                      "<li>Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).</li>" +
                      "<li>Consulta y generación de resguardo de bienes (Resguardo de activo fijo).</li>" +
                      "<li>Préstamo de Activo Fijo.</li>" +
                      "<li>Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).</li>" +
                      "<li>Trazabilidad de operaciones.</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BDirec { get; set; } = false;

    [Display(
        Name = "DIRECTOR GENERAL (Director de URC)",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>DIRECTOR GENERAL</span> <i>(Director de URC).</i> Usuario identificado como el Titular / Director / Responsable / Encargado de la Unidad Responsable Concentradora (URC), también figura como revisor URC. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Registro y consulta de anteproyectos y proyectos de PBR.</li>" +
                      "<li>Registro y consulta de requerimientos presupuestales.</li>" +
                      "<li>Registro de avance programático y seguimiento de proyectos de PBR.</li>" +
                      "<li>Registro y consulta de trámites de la DRM (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Consulta de trámites de la DE y DSG (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Revisión y autorización de trámites de egresos (solicitud del egreso y egreso según corresponda).</li>" +
                      "<li>Carga de Facturas (XML).</li>" +
                      "<li>Recepción de mercancía interna.</li>" +
                      "<li>Consulta del catálogo de claves presupuestarias.</li>" +
                      "<li>Consulta la disponibilidad financiera.</li>" +
                      "<li>Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).</li>" +
                      "<li>Consulta y generación de resguardo de bienes (Resguardo de activo fijo).</li>" +
                      "<li>Préstamo de Activo Fijo.</li>" +
                      "<li>Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).</li>" +
                      "<li>Trazabilidad de operaciones.</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BDirGen { get; set; } = false;

    [Display(
        Name = "ADMINISTRADOR",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>ADMINISTRADOR.</span> Usuario que realiza actividades administrativas que es determinado como \"Administrador\". Solo puede haber un administrador por UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Registro y consulta de anteproyectos y proyectos de PBR.</li>" +
                      "<li>Registro y consulta de requerimientos presupuestales.</li>" +
                      "<li>Registro de avance programático y seguimiento de proyectos de PBR.</li>" +
                      "<li>Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Carga de Facturas (XML).</li>" +
                      "<li>Recepción de mercancía interna.</li>" +
                      "<li>Consulta del catálogo de claves presupuestarias.</li>" +
                      "<li>Consulta la disponibilidad financiera.</li>" +
                      "<li>Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).</li>" +
                      "<li>Consulta y generación de resguardo de bienes (Resguardo de activo fijo).</li>" +
                      "<li>Préstamo de Activo Fijo.</li>" +
                      "<li>Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).</li>" +
                      "<li>Trazabilidad de operaciones.</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BAdmin { get; set; } = false;

    [Display(
        Name = "AUXILIAR ADMINISTRATIVO",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>AUXILIAR ADMINISTRATIVO.</span> Usuario que apoya en las actividades administrativas y es auxiliar del Administrador. En las UR's puede haber más de un auxiliar asignado. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Registro y consulta de anteproyectos y proyectos de PBR.</li>" +
                      "<li>Registro y consulta de requerimientos presupuestales.</li>" +
                      "<li>Registro de avance programático y seguimiento de proyectos de PBR.</li>" +
                      "<li>Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Carga de Facturas (XML).</li>" +
                      "<li>Recepción de mercancía interna.</li>" +
                      "<li>Consulta del catálogo de claves presupuestarias.</li>" +
                      "<li>Consulta la disponibilidad financiera.</li>" +
                      "<li>Trazabilidad de operaciones.</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BAuxAdm { get; set; } = false;

    [Display(
        Name = "RESPONSABLE DE PROYECTO",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>RESPONSABLE DE PROYECTO.</span> Usuario responsable de una o varias claves programáticas. Por UR puede haber más de un usuario con este permiso. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Registro y consulta de anteproyectos y proyectos de PBR.</li>" +
                      "<li>Registro y consulta de requerimientos presupuestales.</li>" +
                      "<li>Registro de avance programático y seguimiento de proyectos de PBR.</li>" +
                      "<li>Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).</li>" +
                      "<li>Carga de Facturas (XML).</li>" +
                      "<li>Recepción de mercancía interna.</li>" +
                      "<li>Consulta del catálogo de claves presupuestarias.</li>" +
                      "<li>Consulta la disponibilidad financiera.</li>" +
                      "<li>Trazabilidad de operaciones.</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BResProy { get; set; } = false;

    [Display(
        Name = "RESPONSABLE DE CONTROL DE BIENES",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>RESPONSABLE DE CONTROL DE BIENES.</span> Usuario encargado de realizar movimientos de inventario. Puede haber más de un usuario con este permiso por UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).</li>" +
                      "<li>Consulta y generación de resguardo de bienes (Resguardo de activo fijo).</li>" +
                      "<li>Préstamo de Activo Fijo.</li>" +
                      "<li>Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).</li>" +
                      "<li>Generación de reportes para emitir información registrada en los diversos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BResCB { get; set; } = false;

    [Display(
        Name = "ESTUDIANTES",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>ESTUDIANTES</span> <i>(Generación de Formatos de Pago).</i> Usuario responsable de generar lineas de captura e inscripciones de alumnos. Por UR puede haber más de un usuario con este permiso. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Acceso al registro de cobros por ventanilla y generación de líneas de captura.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BEstudi { get; set; } = false;

    [Display(
        Name = "EVENTOS INGRESOS",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>EVENTOS INGRESOS</span> <i>(Generación de Formatos de Pago por un bien o servicio).</i> Usuario responsable de generar líneas de captura por el pago de bienes o servicios por tipo de clave del evento, se puede asignar más de un usuario por UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Acceso al módulo de ingresos y cobros.</li>" +
                      "<li>Generar líneas de captura en el registro por ventanilla.</li>" +
                      "<li>Consulta de pagos por líneas de captura.</li>" +
                      "<li>Generación de reportes con la información.</li>" +
                      "<li>Consulta de trazabilidad de las operaciones de ingreso.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BEvenIng { get; set; } = false;

    [Display(
        Name = "SUPERVISOR",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>SUPERVISOR.</span> Usuario encargado de realizar las actividades de supervisor de los cajeros. Solo puede haber un supervisor por UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Acceso a módulos relacionados con punto de venta y cobro (cuentas por cobrar).</li>" +
                      "<li>Generación de reportes para emitir información registrada en dichos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BSuper { get; set; } = false;

    [Display(
        Name = "CAJEROS",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>CAJEROS.</span> Usuario encargado del cobro de conceptos de ingresos. Puede haber más de un cajero por UR. Los permisos que le serán asignados le permitirán realizar las siguientes actividades:" +
                      "<ul class='ps-4 my-1'>" +
                      "<li>Acceso a módulos relacionados con ingresos y cobro (cuentas por cobrar).</li>" +
                      "<li>Generación de reportes para emitir información registrada en dichos apartados.</li>" +
                      "</ul>" +
                      "</div>")]
    public bool BCajeros { get; set; } = false;

    [Display(
        Name = "REVISOR",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>REVISOR.</span> Usuario encargado de revisar mediante el cambio de estado, ya sea anteproyectos, PbR requerimientos presupuestales, trámites de egresos, requisiciones y trámites de servicios generales. Dependiendo la actividad a realizar se le asignará el permiso correspondiente, por lo que tendrá que especificar la operación u operaciones a revisar." +
                      "</div>")]
    public bool BRevisor { get; set; } = false;

    [Display(
        Name = "OTRO GRUPO",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>OTRO GRUPO:</span> esta casilla se marcará en caso de que en el listado de grupos no se encuentre el grupo a solicitar y deberá capturar en las especificaciones el grupo al que desea el acceso. Si se desconoce qué grupo solicitar deberá indicar las actividades que va a realizar el usuario, tal es el caso de los Secretario de Administración y finanzas regional, auditores internos y externos entre otros." +
                      "</div>")]
    public bool BOtroGru { get; set; } = false;

    [Display(
        Name = "UR adicional",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>UR adicional:</span> marcará esta casilla cuando el permiso a solicitar asignar UR adicionales al usuario y deberá especificar qué UR se requiere adicionar, por clave de UR y descripción." +
                      "</div>")]
    public bool BUrAdici { get; set; } = false;

    [Display(
        Name = "Permiso específico",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>Permiso específico:</span> esta casilla se marcará en caso de que se requiera asignar un permiso en específico a nivel usuario o grupo, por lo que deberá especificar y justificar el acceso a solicitar, también, se deberá anexar al formato imágenes con la descripción del permiso requerido." +
                      "</div>")]
    public bool BPermEsp { get; set; } = false;

    [Display(
        Name = "Asignar permisos similares a otro usuario",
        Description = "<div class='text-start'>" +
                      "<span class='fw-bold'>Asignar permisos similares a otro usuario:</span> seleccionará esta casilla si el permiso a solicitar será similar al de otro usuario y deberá especificar el nombre de usuario del que se copiaran los accesos." +
                      "</div>")]
    public bool BPermSim { get; set; } = false;

    // Campos de texto detallado

    public string? SDetaRev { get; set; }

    public string? SDetaGru { get; set; }

    public string? SDetUrA { get; set; }

    public string? SDetaEsp { get; set; }

    public string? SDetaSim { get; set; }

    public string? SEspeci { get; set; }

    // ---

    // --- Humanos ---

    [Required(ErrorMessage = "La clave de la Entidad Académica o Dependencia es obligatoria.")]
    [Display(Name = "Clave de la Dependencia")]
    public int? NEntClv { get; set; }

    [Required(ErrorMessage = "El nombre de la Entidad Académica o Dependencia es obligatorio.")]
    [Display(Name = "Nombre de la Dependencia")]
    public string? SEntNomb { get; set; }

    public Perfil SPerfil { get; set; } = Perfil.SAdmin;

    public int? NClvDep { get; set; }

    public string? SClvProg { get; set; }

    public Permiso STipPerm { get; set; } = Permiso.SConsult;

    public Movimiento SHumaMov { get; set; } = Movimiento.SAlta;

    public List<VmUsuarioAdicional> LsUsuariosAdicionales { get; set; } = new List<VmUsuarioAdicional>();

    // ---

    // --- Datos Utilidad ---

    public string? SEstatus { get; set; }

    public DateTime DtFecCre { get; set; } = DateTime.Now;

    public DateTime DtUltAct { get; set; } = DateTime.Now;

    public bool BEstuAct { get; set; } = false;

    public bool BFinaAct { get; set; } = false;

    public bool BHumaAct { get; set; } = false;

    public string? SAutor { get; set; }

    // ---
}