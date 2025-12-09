document.addEventListener("DOMContentLoaded", function () {

    // Activar botones tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            animation: true,
            delay: { "show": 100, "hide": 100 }
        })
    });
    // ----------

    // Checkboxes Especiales
    const checkboxesEspeciales = document.querySelectorAll('.toggle-detalle');
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
    // ----------

    // Especificaciones Contador
    //const textArea = document.getElementById('especificaciones');
    //const contador = document.getElementById('contador');
    //const maxLength = textArea.getAttribute('maxlength');

    //contador.textContent = `${maxLength}/${maxLength}`;
    //contador.style.color = "#6c757d";

    //textArea.addEventListener('input', () => {
    //    const caracteresEscritos = textArea.value.length;
    //    const caracteresRestantes = maxLength - caracteresEscritos;
    //    contador.textContent = `${caracteresRestantes}/${maxLength}`;
    //    if (caracteresRestantes <= 20) {
    //        contador.style.color = "#dc3545";
    //    } else {
    //        contador.style.color = "#6c757d";
    //    }
    //});
    // ----------

    // Form Solicitud
    const formSolicitud = document.getElementById('form-solicitud');
    if (!formSolicitud) return;
    const lstxtInputsParaValidar = formSolicitud.querySelectorAll('input[required], textarea[required], input[type="email"]');
    const btnDescargar = document.getElementById('btn-descargar-solicitud');
    function fnbVerificarForm() {
        for (const txtInput of lstxtInputsParaValidar) {
            if (!txtInput.checkValidity()) {
                return false;
            }
        }
        return true;
    }
    function alternarBtnDescargar(bHabilitar) {
        btnDescargar.disabled = !bHabilitar;
    }
    formSolicitud.addEventListener('input', () => {
        const bEsValido = fnbVerificarForm();
        alternarBtnDescargar(bEsValido);
    });
    // ----------

    // Tabla Actividades
    var nTamPag = parseInt($('#ddlActividades').val(), 10) || 10;
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
        autoWidth: false
    });
    function fnsLimpiarTexto(texto) {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .replace(/<[^>]*>?/gm, '') // Elimina cualquier etiqueta HTML (<span>, <br>, etc.)
            .replace(/\s+/g, ' ')      // Convierte saltos de línea y espacios múltiples en un solo espacio
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos (á -> a)
            .replace(/[^\w\s]/gi, '')  // Elimina caracteres especiales como ( ) . ,
            .trim();
    }
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var filtroRaw = $('#ddlPermisos').val();
            if (!filtroRaw) return true;
            var filtroLimpio = fnsLimpiarTexto(filtroRaw);
            var contenidoFila = fnsLimpiarTexto(data[0]);
            return contenidoFila.includes(filtroLimpio);
        }
    );
    $('#ddlPermisos').on('change', function () {
        tblActividades.draw();
    });
    $('#ddlActividades').on('change', function () {
        var nTamTbl = parseInt($(this).val(), 10);
        tblActividades.page.len(nTamTbl).draw();
    });
    $('#txtBuscar').on('keyup', function () {
        tblActividades.search($(this).val()).draw();
    });
    // ----------


    // Acciones quien hara la solicitud (prueba temporal)
    //const btnYo = document.getElementById('btn-yo');
    //const btnOtro = document.getElementById('btn-otro');
    //const seccionBuscar = document.getElementById('seccion-buscar-usuario');
    //const inputsDatos = document.querySelectorAll('#info-basica input, #info-basica select');
    //const misDatos = {};
    //inputsDatos.forEach(input => {
    //    misDatos[input.id] = input.value;
    //});
    //function fnIntercambiarCampos(bloquear) {
    //    inputsDatos.forEach(input => {
    //        if (bloquear) {
    //            if (input.tagName === 'SELECT') {
    //                input.setAttribute('disabled', true);
    //            } else {
    //                input.setAttribute('readonly', true);
    //            }
    //            input.classList.add('bg-light', 'text-muted');
    //            input.classList.remove('bg-white', 'text-dark');
    //        } else {
    //            if (input.tagName === 'SELECT') {
    //                input.removeAttribute('disabled');
    //            } else {
    //                input.removeAttribute('readonly');
    //            }
    //            input.classList.remove('bg-light', 'text-muted');
    //            input.classList.add('bg-white', 'text-dark');
    //        }
    //    });
    //}
    //btnYo.addEventListener('click', function () {
    //    btnYo.classList.replace('btn-outline-primary', 'btn-primary');
    //    btnYo.classList.add('active');
    //    btnOtro.classList.replace('btn-secondary', 'btn-outline-secondary');
    //    btnOtro.classList.remove('active');
    //    seccionBuscar.classList.add('d-none');
    //    inputsDatos.forEach(input => {
    //        input.value = misDatos[input.id] || '';
    //    });
    //    fnIntercambiarCampos(true);
    //});
    //btnOtro.addEventListener('click', function () {
    //    btnOtro.classList.replace('btn-outline-secondary', 'btn-secondary');
    //    btnOtro.classList.add('active');
    //    btnYo.classList.replace('btn-primary', 'btn-outline-primary');
    //    btnYo.classList.remove('active');
    //    seccionBuscar.classList.remove('d-none');
    //    inputsDatos.forEach(input => {
    //        input.value = '';
    //    });
    //    fnIntercambiarCampos(false);
    //    document.getElementById('buscador-usuarios').focus();
    //});
    //fnIntercambiarCampos(true);
    // ----------


    // Boton para salir de la solicitud
    //let hayCambiosSinGuardar = false;
    //let urlDestino = "";
    //const btnRegresar = document.getElementById('btnRegresar');
    //const modalSalida = new bootstrap.Modal(document.getElementById('modalConfirmarSalida'));
    //form.addEventListener('input', () => { hayCambiosSinGuardar = true; });
    //form.addEventListener('change', () => { hayCambiosSinGuardar = true; });
    //form.addEventListener('submit', () => { hayCambiosSinGuardar = false; });
    //if (btnRegresar) {
    //    btnRegresar.addEventListener('click', function (e) {
    //        if (hayCambiosSinGuardar) {
    //            e.preventDefault();
    //            urlDestino = this.href;
    //            modalSalida.show();
    //        }
    //    });
    //}
    //document.getElementById('btn-descartar').addEventListener('click', function () {
    //    hayCambiosSinGuardar = false;
    //    window.location.href = urlDestino;
    //});
    //document.getElementById('btn-guardar-borrador').addEventListener('click', async function () {
    //    const btn = this;
    //    btn.disabled = true;
    //    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    //    const formData = new FormData(form);
    //    try {
    //        const response = await fetch('@Url.Action("GuardarBorrador", "Solicitud")', {
    //            method: 'POST',
    //            body: formData
    //        });
    //        const result = await response.json();
    //        if (result.success) {
    //            hayCambiosSinGuardar = false;
    //            window.location.href = urlDestino; // Éxito -> Ir a Inicio
    //        } else {
    //            alert("Error: " + result.message);
    //            btn.disabled = false;
    //        }
    //    } catch (error) {
    //        alert("Error de red");
    //        btn.disabled = false;
    //    }
    //});
    // ----------


    // Busqueda de usuario

    // --- ELEMENTOS DOM ---
    const inputBuscador = document.getElementById('txtBuscar');
    const divResultados = document.getElementById('divResultadosBusqueda');
    const btnManual = document.getElementById('btnManual');

    // Referencias a los inputs del formulario (Usamos los IDs generados por asp-for)
    const inputs = {
        nombre: document.getElementById('vmSolicitud_SNomEmpl'),
        noPersonal: document.getElementById('vmSolicitud_NNoPer'),
        claveUsuario: document.getElementById('vmSolicitud_NUsrClv'),
        correo: document.getElementById('vmSolicitud_SCorreo'),
        urClave: document.getElementById('vmSolicitud_NUResClv'),
        urNombre: document.getElementById('vmSolicitud_SUResNom'),
        region: document.getElementById('vmSolicitud_SRegion'),
        puesto: document.getElementById('vmSolicitud_SPueEmpl')
    };

    // Todos los inputs del divUsuario para bloquear/desbloquear en lote
    const todosInputsDiv = document.querySelectorAll('#divUsuario input, #divUsuario select');

    // --- 1. FUNCIÓN: BUSCAR EMPLEADO ---
    inputBuscador.addEventListener('input', function () {
        const termino = this.value;

        if (termino.length < 3) {
            divResultados.innerHTML = '';
            divResultados.classList.remove('show');
            return;
        }

        // Llamada AJAX al controlador
        fetch(`@Url.Action("BuscarEmpleado", "Solicitud")?termino=${termino}`)
            .then(response => response.json())
            .then(data => {
                divResultados.innerHTML = '';

                if (data.length > 0) {
                    divResultados.classList.add('show'); // Mostrar dropdown

                    data.forEach(emp => {
                        // Crear elemento de lista
                        const item = document.createElement('a');
                        item.classList.add('dropdown-item', 'cursor-pointer', 'border-bottom', 'py-2');
                        item.href = "#";
                        item.innerHTML = `
                                    <div class="fw-bold">${emp.nombre}</div>
                                    <div class="small text-muted">No: ${emp.noPersonal} - ${emp.puesto}</div>
                                `;

                        // Evento Click en un resultado
                        item.addEventListener('click', (e) => {
                            e.preventDefault();
                            rellenarDatos(emp);
                            divResultados.classList.remove('show');
                            inputBuscador.value = ''; // Limpiar buscador
                        });

                        divResultados.appendChild(item);
                    });
                } else {
                    divResultados.classList.remove('show');
                }
            });
    });

    // --- 2. FUNCIÓN: RELLENAR DATOS (Autocompletado) ---
    function rellenarDatos(emp) {
        // Asignar valores
        inputs.nombre.value = emp.nombre;
        inputs.noPersonal.value = emp.noPersonal;
        inputs.claveUsuario.value = emp.claveUsuario;
        inputs.correo.value = emp.correo;
        inputs.urClave.value = emp.urClave;
        inputs.urNombre.value = emp.urNombre;
        inputs.region.value = emp.region;
        inputs.puesto.value = emp.puesto;

        // Asegurar que sigan bloqueados (Solo lectura) para evitar errores manuales
        bloquearCampos(true);
    }

    // --- 3. FUNCIÓN: MODO MANUAL (Desbloquear) ---
    btnManual.addEventListener('click', function (e) {
        e.preventDefault(); // Evitar que el botón haga submit si está dentro de un form

        // Limpiar campos (opcional, si quieres que escriban desde cero)
        // O puedes dejarlos con los datos actuales para editar sobre ellos.

        bloquearCampos(false); // Desbloquear todo

        // Dar foco al primer campo
        inputs.nombre.focus();
    });

    // --- AUXILIAR: BLOQUEAR / DESBLOQUEAR ---
    function bloquearCampos(bloquear) {
        todosInputsDiv.forEach(el => {
            if (bloquear) {
                // MODO BLOQUEADO
                el.setAttribute('readonly', true);
                if (el.tagName === 'SELECT') el.setAttribute('disabled', true);

                el.classList.add('bg-light');
                el.classList.remove('bg-white');
            } else {
                // MODO EDITABLE
                el.removeAttribute('readonly');
                if (el.tagName === 'SELECT') el.removeAttribute('disabled');

                el.classList.remove('bg-light');
                el.classList.add('bg-white');
            }
        });
    }
    // ----------
});