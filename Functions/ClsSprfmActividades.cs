using System;
using System.ComponentModel.DataAnnotations;

public enum ClsSprfmActividades
{
    // DIRECTOR
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Registro y consulta de anteproyectos y proyectos de PBR.")]
    DIRECTOR1,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Registro y consulta de requerimientos presupuestales.")]
    DIRECTOR2,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Registro de avance programático y seguimiento de proyectos de PBR.")]
    DIRECTOR3,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Registro y consulta de trámites de la DRM (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    DIRECTOR4,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Consulta de trámites de la DE y DSG (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    DIRECTOR5,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Revisión y autorización de trámites de egresos (solicitud del egreso y egreso según corresponda).")]
    DIRECTOR6,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Carga de Facturas (XML).")]
    DIRECTOR7,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Recepción de mercancía interna.")]
    DIRECTOR8,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Consulta del catálogo de claves presupuestarias.")]
    DIRECTOR9,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Consulta la disponibilidad financiera.")]
    DIRECTOR10,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).")]
    DIRECTOR11,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Consulta y generación de resguardo de bienes (Resguardo de activo fijo).")]
    DIRECTOR12,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Préstamo de Activo Fijo.")]
    DIRECTOR13,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).")]
    DIRECTOR14,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Trazabilidad de operaciones.")]
    DIRECTOR15,
    [Display(Name = "DIRECTOR (Director de UR)", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    DIRECTOR16,

    // DIRECTOR GENERAL (Director de URC)
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Registro y consulta de anteproyectos y proyectos de PBR.")]
    DIRECTORGENERAL1,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Registro y consulta de requerimientos presupuestales.")]
    DIRECTORGENERAL2,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Registro de avance programático y seguimiento de proyectos de PBR.")]
    DIRECTORGENERAL3,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Registro y consulta de trámites de la DRM (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    DIRECTORGENERAL4,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Consulta de trámites de la DE y DSG (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    DIRECTORGENERAL5,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Revisión y autorización de trámites de egresos (solicitud del egreso y egreso según corresponda).")]
    DIRECTORGENERAL6,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Carga de Facturas (XML).")]
    DIRECTORGENERAL7,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Recepción de mercancía interna.")]
    DIRECTORGENERAL8,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Consulta del catálogo de claves presupuestarias.")]
    DIRECTORGENERAL9,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Consulta la disponibilidad financiera.")]
    DIRECTORGENERAL10,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).")]
    DIRECTORGENERAL11,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Consulta y generación de resguardo de bienes (Resguardo de activo fijo).")]
    DIRECTORGENERAL12,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Préstamo de Activo Fijo.")]
    DIRECTORGENERAL13,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).")]
    DIRECTORGENERAL14,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Trazabilidad de operaciones.")]
    DIRECTORGENERAL15,
    [Display(Name = "DIRECTOR GENERAL (Director de URC)", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    DIRECTORGENERAL16,

    // ADMINISTRADOR
    [Display(Name = "ADMINISTRADOR", Description = "Registro y consulta de anteproyectos y proyectos de PBR.")]
    ADMINISTRADOR1,
    [Display(Name = "ADMINISTRADOR", Description = "Registro y consulta de requerimientos presupuestales.")]
    ADMINISTRADOR2,
    [Display(Name = "ADMINISTRADOR", Description = "Registro de avance programático y seguimiento de proyectos de PBR.")]
    ADMINISTRADOR3,
    [Display(Name = "ADMINISTRADOR", Description = "Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    ADMINISTRADOR4,
    [Display(Name = "ADMINISTRADOR", Description = "Carga de Facturas (XML).")]
    ADMINISTRADOR5,
    [Display(Name = "ADMINISTRADOR", Description = "Recepción de mercancía interna.")]
    ADMINISTRADOR6,
    [Display(Name = "ADMINISTRADOR", Description = "Consulta del catálogo de claves presupuestarias.")]
    ADMINISTRADOR7,
    [Display(Name = "ADMINISTRADOR", Description = "Consulta la disponibilidad financiera.")]
    ADMINISTRADOR8,
    [Display(Name = "ADMINISTRADOR", Description = "Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).")]
    ADMINISTRADOR9,
    [Display(Name = "ADMINISTRADOR", Description = "Consulta y generación de resguardo de bienes (Resguardo de activo fijo).")]
    ADMINISTRADOR10,
    [Display(Name = "ADMINISTRADOR", Description = "Préstamo de Activo Fijo.")]
    ADMINISTRADOR11,
    [Display(Name = "ADMINISTRADOR", Description = "Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).")]
    ADMINISTRADOR12,
    [Display(Name = "ADMINISTRADOR", Description = "Trazabilidad de operaciones.")]
    ADMINISTRADOR13,
    [Display(Name = "ADMINISTRADOR", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    ADMINISTRADOR14,

    // AUXILIAR ADMINISTRATIVO
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Registro y consulta de anteproyectos y proyectos de PBR.")]
    AUXILIARADMINISTRATIVO1,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Registro y consulta de requerimientos presupuestales.")]
    AUXILIARADMINISTRATIVO2,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Registro de avance programático y seguimiento de proyectos de PBR.")]
    AUXILIARADMINISTRATIVO3,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    AUXILIARADMINISTRATIVO4,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Carga de Facturas (XML).")]
    AUXILIARADMINISTRATIVO5,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Recepción de mercancía interna.")]
    AUXILIARADMINISTRATIVO6,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Consulta del catálogo de claves presupuestarias.")]
    AUXILIARADMINISTRATIVO7,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Consulta la disponibilidad financiera.")]
    AUXILIARADMINISTRATIVO8,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Trazabilidad de operaciones.")]
    AUXILIARADMINISTRATIVO9,
    [Display(Name = "AUXILIAR ADMINISTRATIVO", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    AUXILIARADMINISTRATIVO10,

    // RESPONSABLE DE PROYECTO
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Registro y consulta de anteproyectos y proyectos de PBR.")]
    RESPONSABLEPROYECTO1,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Registro y consulta de requerimientos presupuestales.")]
    RESPONSABLEPROYECTO2,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Registro de avance programático y seguimiento de proyectos de PBR.")]
    RESPONSABLEPROYECTO3,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Registro y consulta de trámites (requisición de egreso, solicitud del egreso y egreso entre otros).")]
    RESPONSABLEPROYECTO4,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Carga de Facturas (XML).")]
    RESPONSABLEPROYECTO5,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Recepción de mercancía interna.")]
    RESPONSABLEPROYECTO6,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Consulta del catálogo de claves presupuestarias.")]
    RESPONSABLEPROYECTO7,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Consulta la disponibilidad financiera.")]
    RESPONSABLEPROYECTO8,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Trazabilidad de operaciones.")]
    RESPONSABLEPROYECTO9,
    [Display(Name = "RESPONSABLE DE PROYECTO", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    RESPONSABLEPROYECTO10,

    // RESPONSABLE DE CONTROL DE BIENES
    [Display(Name = "RESPONSABLE DE CONTROL DE BIENES", Description = "Consulta de información bienes muebles e inmuebles (Catálogo de activo fijo).")]
    RESPONSABLECONTROLBIENES1,
    [Display(Name = "RESPONSABLE DE CONTROL DE BIENES", Description = "Consulta y generación de resguardo de bienes (Resguardo de activo fijo).")]
    RESPONSABLECONTROLBIENES2,
    [Display(Name = "RESPONSABLE DE CONTROL DE BIENES", Description = "Préstamo de Activo Fijo.")]
    RESPONSABLECONTROLBIENES3,
    [Display(Name = "RESPONSABLE DE CONTROL DE BIENES", Description = "Transferencia de bienes entre unidades responsables (Modulo de Transferencia de mercancía interna).")]
    RESPONSABLECONTROLBIENES4,
    [Display(Name = "RESPONSABLE DE CONTROL DE BIENES", Description = "Generación de reportes para emitir información registrada en los diversos apartados.")]
    RESPONSABLECONTROLBIENES5,

    // ESTUDIANTES
    [Display(Name = "ESTUDIANTES", Description = "Acceso al registro de cobros por ventanilla y generación de líneas de captura.")]
    ESTUDIANTES1,

    // EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)
    [Display(Name = "EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)", Description = "Acceso al módulo de ingresos y cobros.")]
    EVENTOSINGRESOS1,
    [Display(Name = "EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)", Description = "Generar líneas de captura en el registro por ventanilla.")]
    EVENTOSINGRESOS2,
    [Display(Name = "EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)", Description = "Consulta de pagos por líneas de captura.")]
    EVENTOSINGRESOS3,
    [Display(Name = "EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)", Description = "Generación de reportes con la información.")]
    EVENTOSINGRESOS4,
    [Display(Name = "EVENTOS INGRESOS (Generación de Formatos de Pago por un bien o servicio)", Description = "Consulta de trazabilidad de las operaciones de ingreso.")]
    EVENTOSINGRESOS5,

    // SUPERVISOR
    [Display(Name = "SUPERVISOR", Description = "Acceso a módulos relacionados con punto de venta y cobro (cuentas por cobrar).")]
    SUPERVISOR1,
    [Display(Name = "SUPERVISOR", Description = "Generación de reportes para emitir información registrada en dichos apartados.")]
    SUPERVISOR2,

    // CAJEROS
    [Display(Name = "CAJEROS", Description = "Acceso a módulos relacionados con ingresos y cobro (cuentas por cobrar).")]
    CAJEROS1,
    [Display(Name = "CAJEROS", Description = "Generación de reportes para emitir información registrada en dichos apartados.")]
    CAJEROS2,

    // REVISOR
    [Display(Name = "REVISOR", Description = "Tendrá que especificar la operación u operaciones a revisar")]
    REVISOR,

    // OTRO GRUPO
    [Display(Name = "OTRO GRUPO", Description = "Indicar las actividades que va a realizar el usuario.")]
    OTROGRUPO,

    // UR adicional
    [Display(Name = "UR adicional", Description = "Deberá especificar qué UR se requiere adicionar, por clave de UR y descripción.")]
    URADICIONAL,

    // Permiso especifico
    [Display(Name = "Permiso específico", Description = "Deberá especificar y justificar el acceso a solicitar, también, se deberá anexar al formato imágenes con la descripción del permiso requerido.")]
    PERMISOESPECIFICO,

    // Permisos similares
    [Display(Name = "Asignar permisos similares a otro usuario", Description = "Deberá especificar el nombre de usuario del que se copiaran los accesos.")]
    PERMISOSIMILAR,
}