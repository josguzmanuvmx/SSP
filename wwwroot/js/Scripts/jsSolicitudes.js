$(document).ready(function () {
    var nTamPag = parseInt($('#ddlSolicitudes').val(), 10) || 10;

    var tblSolicitudes = $('#tblSolicitudes').DataTable({
        responsive: true,
        ordering: true,
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

    $('#ddlSolicitudes').on('change', function () {
        var nTamTbl = parseInt($(this).val(), 10);
        tblSolicitudes.page.len(nTamTbl).draw();
    });

    $('#txtBuscar').on('keyup', function () {
        realizarBusqueda();
    });

    realizarBusqueda();

    function realizarBusqueda() {
        var sBusqueda = $('#txtBuscar').val();
        tblSolicitudes.search(sBusqueda).draw();
    }

    const btnConfirmar = document.getElementById('btnConfirmarEliminar');

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function () {

            // a. Recuperamos el ID que guardamos previamente
            const idParaBorrar = document.getElementById('hdnIdEliminar').value;

            // b. UI: Desactivar botón y poner spinner para evitar doble clic
            const btnOriginalHtml = btnConfirmar.innerHTML;
            btnConfirmar.disabled = true;
            btnConfirmar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Eliminando...';

            // c. Petición AJAX
            $.ajax({
                url: '/Solicitudes/Eliminar',
                type: 'POST',
                data: { sId: idParaBorrar }, // Enviamos sId al controller
                success: function (response) {
                    if (response.success) {
                        // Cerrar modal
                        const modalElement = document.getElementById('modalEliminar');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide();

                        // Opción A: Recargar toda la página
                        location.reload();

                        // Opción B (Más elegante): Eliminar la fila de la tabla sin recargar
                        // Para esto necesitarías que el <tr> tenga un id único, ej: <tr id="row_@solicitud.SId">
                        // $(`#row_${idParaBorrar}`).remove();
                    } else {
                        // Si falla, mostramos alerta (aquí sí puedes usar un alert simple o un toast)
                        alert("Error: " + response.message);
                        // Restaurar botón
                        btnConfirmar.disabled = false;
                        btnConfirmar.innerHTML = btnOriginalHtml;
                    }
                },
                error: function () {
                    alert("Error de conexión con el servidor.");
                    // Restaurar botón
                    btnConfirmar.disabled = false;
                    btnConfirmar.innerHTML = btnOriginalHtml;
                }
            });
        });
    }
});

function fnAbrirModalEliminar(idEncriptado) {
    // a. Guardamos el ID en el input oculto del modal
    document.getElementById('hdnIdEliminar').value = idEncriptado;

    // b. Abrimos el modal usando la API de Bootstrap 5
    const modalElement = document.getElementById('modalEliminar');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}