document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.getElementById('especificaciones');
    const contador = document.getElementById('contador');
    const maxLength = textArea.getAttribute('maxlength');
    const checkboxesEspeciales = document.querySelectorAll('.toggle-detalle');

    contador.textContent = `${maxLength}/${maxLength}`;
    contador.style.color = "#6c757d";

    checkboxesEspeciales.forEach(checkbox => {
        const toggleState = (isChecked) => {
            const targetId = checkbox.getAttribute('data-target');
            const targetDiv = document.querySelector(targetId);
            const textarea = targetDiv.querySelector('textarea');

            if (isChecked) {
                targetDiv.classList.remove('d-none');
                textarea.setAttribute('required', 'required');
                setTimeout(() => textarea.focus(), 100);
            } else {
                targetDiv.classList.add('d-none');
                textarea.removeAttribute('required');
                textarea.value = '';
            }
            if (form) form.dispatchEvent(new Event('input'));
        };
        checkbox.addEventListener('change', function () {
            toggleState(this.checked);
        });
        if (checkbox.checked) {
            toggleState(true);
        }
    });

    textArea.addEventListener('input', () => {
        const caracteresEscritos = textArea.value.length;
        const caracteresRestantes = maxLength - caracteresEscritos;
        contador.textContent = `${caracteresRestantes}/${maxLength}`;
        if (caracteresRestantes <= 20) {
            contador.style.color = "#dc3545";
        } else {
            contador.style.color = "#6c757d";
        }
    });

    const form = document.getElementById('form-solicitud');
    if (!form) return;
    const inputsToValidate = form.querySelectorAll('input[required], textarea[required], input[type="email"]');
    const btnDescargar = document.getElementById('btn-descargar-solicitud');
    function verificarForm() {
        for (const input of inputsToValidate) {
            if (!input.checkValidity()) {
                return false;
            }
        }
        return true;
    }
    function alternarBtnDescargar(enable) {
        btnDescargar.disabled = !enable;
    }
    form.addEventListener('input', () => {
        const isValid = verificarForm();
        alternarBtnDescargar(isValid);
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            animation: true,
            delay: { "show": 100, "hide": 100 }
        })
    });

    // Tabla Actividades
    // 1. Configuración Inicial
    var nTamPag = parseInt($('#ddlActividades').val(), 10) || 10;

    // 2. Inicializar DataTables
    var tblActividades = $('#tblActividades').DataTable({
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
        // IMPORTANTE: Esto ayuda a que DataTables redibuje correctamente al cambiar tamaños
        autoWidth: false
    });

    function limpiarTexto(texto) {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .replace(/<[^>]*>?/gm, '') // Elimina cualquier etiqueta HTML (<span>, <br>, etc.)
            .replace(/\s+/g, ' ')      // Convierte saltos de línea y espacios múltiples en un solo espacio
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos (á -> a)
            .replace(/[^\w\s]/gi, '')  // Elimina caracteres especiales como ( ) . ,
            .trim();
    }

    // 3. DEFINIR EL FILTRO PERSONALIZADO (La parte mágica)
    // Esta función se ejecuta cada vez que llamamos a .draw()
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            // a. Obtenemos el valor del select
            var filtroRaw = $('#ddlPermisos').val();

            // Si no hay filtro, mostrar todo
            if (!filtroRaw) return true;

            // b. Limpiamos ambos lados para que la comparación sea justa
            var filtroLimpio = limpiarTexto(filtroRaw);

            // data[0] es la primera columna (Nombre del Permiso)
            // data[1] es la segunda columna (Descripción)
            // Puedes concatenarlos si quieres buscar en ambos, o solo usar data[0]
            var contenidoFila = limpiarTexto(data[0]);

            // Debugging (Míralo en la consola F12 si sigue fallando)
            // console.log("Buscando:", filtroLimpio, "En:", contenidoFila);

            // c. Comparamos
            return contenidoFila.includes(filtroLimpio);
        }
    );

    // 4. EVENTOS (Listeners)

    // A. Cambio en el Dropdown de Permisos
    $('#ddlPermisos').on('change', function () {
        // Simplemente pedimos a la tabla que se "redibuje".
        // Esto activará automáticamente la función de filtro que definimos arriba.
        tblActividades.draw();
    });

    // B. Cambio en el número de registros por página
    $('#ddlActividades').on('change', function () {
        var nTamTbl = parseInt($(this).val(), 10);
        tblActividades.page.len(nTamTbl).draw();
    });

    // C. Búsqueda Global (Input de texto)
    $('#txtBuscar').on('keyup', function () {
        tblActividades.search($(this).val()).draw();
    });
});