$(document).ready(function () {
    var nTamPag = parseInt($('#ddlEmpleados').val(), 10) || 10;

    var tblEmpleados = $('#tblEmpleados').DataTable({
        responsive: true,
        ordering: false,
        paging: true,
        searching: true,
        destroy: true,
        lengthChange: false,
        pageLength: nTamPag,
        lengthMenu: [
            [5, 10, 15, 20, 50, 100],
            [5, 10, 15, 20, 50, 100],
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
            infoEmpty: ""
        },
    });

    $('#ddlEmpleados').on('change', function () {
        var nTamTbl = parseInt($(this).val(), 10);
        tblEmpleados.page.len(nTamTbl).draw();
    });

    $('#txtBuscar').on('keyup', function () {
        realizarBusqueda();
    });

    realizarBusqueda();

    function realizarBusqueda() {
        var sBusqueda = $('#txtBuscar').val();
        tblEmpleados.search(sBusqueda).draw();
    }
});