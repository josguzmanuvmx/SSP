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


    // 1. Elementos
    const btnYo = document.getElementById('btn-yo');
    const btnOtro = document.getElementById('btn-otro');
    const seccionBuscar = document.getElementById('seccion-buscar-usuario');

    // Seleccionamos todos los inputs dentro del div #info-basica
    const inputsDatos = document.querySelectorAll('#info-basica input, #info-basica select');

    // 2. Guardar los datos originales ("Mis Datos") al cargar la página
    // Creamos un objeto para respaldar la información del usuario logueado
    const misDatos = {};
    inputsDatos.forEach(input => {
        misDatos[input.id] = input.value;
    });

    // --- FUNCIÓN AUXILIAR PARA BLOQUEAR/DESBLOQUEAR VISUALMENTE ---
    function toggleCampos(bloquear) {
        inputsDatos.forEach(input => {
            if (bloquear) {
                // MODO "YO": Bloqueado y Oscuro/Muted
                if (input.tagName === 'SELECT') {
                    input.setAttribute('disabled', true);
                } else {
                    input.setAttribute('readonly', true);
                }

                // Estilos visuales "Muted"
                input.classList.add('bg-light', 'text-muted');
                input.classList.remove('bg-white', 'text-dark');
            } else {
                // MODO "OTRO": Editable y Blanco/Normal
                if (input.tagName === 'SELECT') {
                    input.removeAttribute('disabled');
                } else {
                    input.removeAttribute('readonly');
                }

                // Estilos visuales "Normales"
                input.classList.remove('bg-light', 'text-muted');
                input.classList.add('bg-white', 'text-dark');
            }
        });
    }

    // --- EVENTO: CLIC EN "YO LO SOLICITARÉ" ---
    btnYo.addEventListener('click', function () {
        // Estilos de botones
        btnYo.classList.replace('btn-outline-primary', 'btn-primary');
        btnYo.classList.add('active');
        btnOtro.classList.replace('btn-secondary', 'btn-outline-secondary');
        btnOtro.classList.remove('active');

        // Ocultar buscador
        seccionBuscar.classList.add('d-none');

        // Restaurar mis datos
        inputsDatos.forEach(input => {
            input.value = misDatos[input.id] || '';
        });

        // APLICAR BLOQUEO VISUAL
        toggleCampos(true);
    });

    // --- EVENTO: CLIC EN "PARA OTRO USUARIO" ---
    btnOtro.addEventListener('click', function () {
        // Estilos de botones
        btnOtro.classList.replace('btn-outline-secondary', 'btn-secondary');
        btnOtro.classList.add('active');
        btnYo.classList.replace('btn-primary', 'btn-outline-primary');
        btnYo.classList.remove('active');

        // Mostrar buscador
        seccionBuscar.classList.remove('d-none');

        // Limpiar campos
        inputsDatos.forEach(input => {
            input.value = '';
        });

        // QUITAR BLOQUEO VISUAL (Hacerlos editables)
        toggleCampos(false);

        // Foco en el buscador
        document.getElementById('buscador-usuarios').focus();
    });

    // --- ESTADO INICIAL ---
    // Al cargar la página, forzamos el estado "Bloqueado" (Modo Yo)
    toggleCampos(true);



    // --- VARIABLES DE ESTADO ---
    let hayCambiosSinGuardar = false;
    let urlDestino = ""; // Aquí guardaremos la URL de "Inicio"

    // --- REFERENCIAS ---
    const btnRegresar = document.getElementById('btnRegresar');
    const modalSalida = new bootstrap.Modal(document.getElementById('modalConfirmarSalida'));

    // 1. DETECTAR CAMBIOS EN EL FORMULARIO
    // Si el usuario toca cualquier input, activamos la bandera
    form.addEventListener('input', () => { hayCambiosSinGuardar = true; });
    form.addEventListener('change', () => { hayCambiosSinGuardar = true; });

    // Excepción: Si se hace SUBMIT normal (Botón Guardar), apagamos la bandera
    form.addEventListener('submit', () => { hayCambiosSinGuardar = false; });

    // 2. INTERCEPTAR EL BOTÓN REGRESAR
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function (e) {
            // Si hay cambios pendientes...
            if (hayCambiosSinGuardar) {
                e.preventDefault(); // ¡ALTO! No navegues todavía.

                // Guardamos la URL a la que el botón quería ir (/Inicio/Index)
                urlDestino = this.href;

                // Mostramos el modal
                modalSalida.show();
            }
            // Si NO hay cambios, deja que el botón funcione normal y regrese.
        });
    }

    // --- LÓGICA DEL MODAL ---

    // A. BOTÓN "DESCARTAR CAMBIOS" (En el modal)
    document.getElementById('btn-descartar').addEventListener('click', function () {
        hayCambiosSinGuardar = false; // Ya no nos importa
        window.location.href = urlDestino; // Navegamos manualmente a Inicio
    });

    // B. BOTÓN "GUARDAR BORRADOR" (En el modal)
    document.getElementById('btn-guardar-borrador').addEventListener('click', async function () {
        // ... (Aquí va tu lógica de fetch para guardar borrador que vimos antes) ...

        // Ejemplo rápido:
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

        const formData = new FormData(form);

        try {
            const response = await fetch('@Url.Action("GuardarBorrador", "Solicitud")', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                hayCambiosSinGuardar = false;
                window.location.href = urlDestino; // Éxito -> Ir a Inicio
            } else {
                alert("Error: " + result.message);
                btn.disabled = false;
            }
        } catch (error) {
            alert("Error de red");
            btn.disabled = false;
        }
    });
});