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
    const lsDivAlternarDetalle = document.querySelectorAll('.alternar-detalle');
    lsDivAlternarDetalle.forEach(checkbox => {
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
            if (formSolicitud) formSolicitud.dispatchEvent(new Event('input'));
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
    //const formSolicitud = document.getElementById('form-solicitud');
    //if (!formSolicitud) return;
    //const lstxtInputsParaValidar = formSolicitud.querySelectorAll('input[required], textarea[required], input[type="email"]');
    //const btnDescargar = document.getElementById('btn-descargar-solicitud');
    //function fnbVerificarForm() {
    //    for (const txtInput of lstxtInputsParaValidar) {
    //        if (!txtInput.checkValidity()) {
    //            return false;
    //        }
    //    }
    //    return true;
    //}
    //function alternarBtnDescargar(bHabilitar) {
    //    btnDescargar.disabled = !bHabilitar;
    //}
    //formSolicitud.addEventListener('input', () => {
    //    const bEsValido = fnbVerificarForm();
    //    alternarBtnDescargar(bEsValido);
    //});
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

    const btnManual = document.getElementById('btnManual');

    // Busqueda de usuario
    const txtBuscarUsuario = document.getElementById('txtBuscarUsuario');
    const divResultados = document.getElementById('divResultadosBusqueda');

    // Referencias a los inputs del formulario (Usamos los IDs generados por asp-for)
    const lsInputs = {
        sNomEmpl: document.getElementById('vmSolicitud_SNomEmpl'),
        nNoPer: document.getElementById('vmSolicitud_NNoPer'),
        nUsrClv: document.getElementById('vmSolicitud_NUsrClv'),
        sCorreo: document.getElementById('vmSolicitud_SCorreo'),
        nUResClv: document.getElementById('vmSolicitud_NUResClv'),
        sUResNom: document.getElementById('vmSolicitud_SUResNom'),
        sRegion: document.getElementById('vmSolicitud_SRegion'),
        sPerfil: document.getElementById('vmSolicitud_SPerfil'),
        sPueEmpl: document.getElementById('vmSolicitud_SPueEmpl')
    };

    // --- 1. FUNCIÓN: BUSCAR EMPLEADO ---
    txtBuscarUsuario.addEventListener('input', async function () {
        const sBusqueda = this.value;

        if (sBusqueda.length < 3) {
            divResultados.innerHTML = '';
            divResultados.classList.remove('show');
            return;
        }

        const urlBusqueda = this.getAttribute('data-url');
        fetch(`${urlBusqueda}?sUsuario=${sBusqueda}`)
            .then(response => response.json())
            .then(data => {
                divResultados.innerHTML = '';

                if (data.length > 0) {
                    divResultados.classList.add('show');
                    data.forEach(emp => {
                        // Crear elemento de lista
                        const item = document.createElement('a');
                        item.classList.add('dropdown-item', 'cursor-pointer');
                        item.href = "#";
                        item.textContent = emp.label;

                        // Evento Click en un resultado
                        item.addEventListener('click', async function (e) {
                            e.preventDefault();
                            rellenarDatos(emp);
                            divResultados.classList.remove('show');
                            txtBuscarUsuario.value = '';
                        });

                        divResultados.appendChild(item);
                    });
                } else {
                    divResultados.classList.remove('show');
                }
            });
    });

    document.addEventListener('click', function (e) {
        if (!txtBuscarUsuario.contains(e.target) && !divResultados.contains(e.target)) {
            divResultados.classList.remove('show');
        }
    });

    // --- 2. FUNCIÓN: RELLENAR DATOS (Autocompletado) ---
    function rellenarDatos(emp) {
        // Asignar valores
        lsInputs.sNomEmpl.value = emp.sNomEmpl;
        lsInputs.nNoPer.value = emp.nNoPer;
        lsInputs.nUsrClv.value = emp.nUsrClv;
        lsInputs.sCorreo.value = emp.sCorreo;
        lsInputs.nUResClv.value = emp.nUResClv;
        lsInputs.sUResNom.value = emp.sUResNom;
        lsInputs.sRegion.value = emp.sRegion;
        lsInputs.sPerfil.value = emp.sPerfil;
        lsInputs.sPueEmpl.value = emp.sPueEmpl;

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
        lsInputs.sNomEmpl.focus();
    });

    // --- AUXILIAR: BLOQUEAR / DESBLOQUEAR ---
    function bloquearCampos(bloquear) {
        Object.values(lsInputs).forEach(el => {
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

    // Verificacion Solicitudes
    const divSinDocumentos = document.getElementById('divSinDocumentos');
    const divDescargarSolicitudes = document.getElementById('divDescargarSolicitudes');
    function fnActualizarDocumentoActivo() {
        const txtEstuAct = document.getElementById('txtEstuAct');
        const txtFinaAct = document.getElementById('txtFinaAct');
        const txtHumaAct = document.getElementById('txtHumaAct');
        const bDocActivo = (txtHumaAct?.checked) || (txtFinaAct?.checked) || (txtEstuAct?.checked);

        if (bDocActivo) {
            // SI HAY ACTIVOS: Ocultar mensaje, Mostrar botón
            divSinDocumentos.classList.add('d-none');
            divDescargarSolicitudes.classList.remove('d-none');
        } else {
            // NO HAY ACTIVOS: Mostrar mensaje, Ocultar botón
            divSinDocumentos.classList.remove('d-none');
            divDescargarSolicitudes.classList.add('d-none');
        }
    }
    // ----------

    // Habilitar Estudiantes
    const txtEstuAct = document.getElementById('txtEstuAct');
    const btnHabilitarEstudiantes = document.getElementById('btnHabilitarEstudiantes');
    const btnDeshabilitarEstudiantes = document.getElementById('btnDeshabilitarEstudiantes');
    const divOverlayEstudiantes = document.getElementById('divOverlayEstudiantes');
    const divContenidoEstudiantes = document.getElementById('divContenidoEstudiantes');
    const lsTxtEstudiantes = divContenidoEstudiantes.querySelectorAll('input, select, textarea');
    const divDocEstudiantes = document.getElementById('divDocEstudiantes');
    function fnAlternarEstudiantes(bModo) {
        txtEstuAct.checked = bModo;
        if (bModo) {
            divOverlayEstudiantes.classList.add('d-none');
            divOverlayEstudiantes.classList.remove('d-flex');
            divContenidoEstudiantes.style.opacity = '1';
            divContenidoEstudiantes.style.pointerEvents = 'auto';
            btnDeshabilitarEstudiantes.classList.remove('d-none');
            lsTxtEstudiantes.forEach(input => input.removeAttribute('disabled'));
            if (divDocEstudiantes) divDocEstudiantes.classList.remove('d-none');
        } else {
            divOverlayEstudiantes.classList.remove('d-none');
            divOverlayEstudiantes.classList.add('d-flex');
            divContenidoEstudiantes.style.opacity = '0.3';
            divContenidoEstudiantes.style.pointerEvents = 'none';
            btnDeshabilitarEstudiantes.classList.add('d-none');
            lsTxtEstudiantes.forEach(input => input.setAttribute('disabled', 'disabled'));
            if (divDocEstudiantes) divDocEstudiantes.classList.add('d-none');
        }
        fnActualizarDocumentoActivo();
    }
    btnHabilitarEstudiantes.addEventListener('click', () => fnAlternarEstudiantes(true));
    btnDeshabilitarEstudiantes.addEventListener('click', () => fnAlternarEstudiantes(false));
    fnAlternarEstudiantes(txtEstuAct.checked);
    // ---

    // Habilitar Finanzas
    const txtFinaAct = document.getElementById('txtFinaAct');
    const btnHabilitarFinanzas = document.getElementById('btnHabilitarFinanzas');
    const btnDeshabilitarFinanzas = document.getElementById('btnDeshabilitarFinanzas');
    const divOverlayFinanzas = document.getElementById('divOverlayFinanzas');
    const divContenidoFinanzas = document.getElementById('divContenidoFinanzas');
    const lsTxtFinanzas = divContenidoFinanzas.querySelectorAll('input, select, textarea');
    const divDocFinanzas = document.getElementById('divDocFinanzas');
    function fnAlternarFinanzas(bModo) {
        txtFinaAct.checked = bModo;
        if (bModo) {
            divOverlayFinanzas.classList.add('d-none');
            divOverlayFinanzas.classList.remove('d-flex');
            divContenidoFinanzas.style.opacity = '1';
            divContenidoFinanzas.style.pointerEvents = 'auto';
            btnDeshabilitarFinanzas.classList.remove('d-none');
            lsTxtFinanzas.forEach(input => input.removeAttribute('disabled'));
            if (divDocFinanzas) divDocFinanzas.classList.remove('d-none');
        } else {
            divOverlayFinanzas.classList.remove('d-none');
            divOverlayFinanzas.classList.add('d-flex');
            divContenidoFinanzas.style.opacity = '0.3';
            divContenidoFinanzas.style.pointerEvents = 'none';
            btnDeshabilitarFinanzas.classList.add('d-none');
            lsTxtFinanzas.forEach(input => input.setAttribute('disabled', 'disabled'));
            if (divDocFinanzas) divDocFinanzas.classList.add('d-none');
        }
        fnActualizarDocumentoActivo();
    }
    btnHabilitarFinanzas.addEventListener('click', () => fnAlternarFinanzas(true));
    btnDeshabilitarFinanzas.addEventListener('click', () => fnAlternarFinanzas(false));
    fnAlternarFinanzas(txtFinaAct.checked);
    // --------

    // Habilitar Humanos
    const txtHumaAct = document.getElementById('txtHumaAct');
    const btnHabilitarHumanos = document.getElementById('btnHabilitarHumanos');
    const btnDeshabilitarHumanos = document.getElementById('btnDeshabilitarHumanos');
    const divOverlayHumanos = document.getElementById('divOverlayHumanos');
    const divContenidoHumanos = document.getElementById('divContenidoHumanos');
    const lsTxtHumanos = divContenidoHumanos.querySelectorAll('input, select, textarea');
    const divDocHumanos = document.getElementById('divDocHumanos');
    function fnAlternarHumanos(bModo) {
        txtHumaAct.checked = bModo;
        if (bModo) {
            divOverlayHumanos.classList.add('d-none');
            divOverlayHumanos.classList.remove('d-flex');
            divContenidoHumanos.style.opacity = '1';
            divContenidoHumanos.style.pointerEvents = 'auto';
            btnDeshabilitarHumanos.classList.remove('d-none');
            lsTxtHumanos.forEach(input => input.removeAttribute('disabled'));
            if (divDocHumanos) divDocHumanos.classList.remove('d-none');
        } else {
            divOverlayHumanos.classList.remove('d-none');
            divOverlayHumanos.classList.add('d-flex');
            divContenidoHumanos.style.opacity = '0.3';
            divContenidoHumanos.style.pointerEvents = 'none';
            btnDeshabilitarHumanos.classList.add('d-none');
            lsTxtHumanos.forEach(input => input.setAttribute('disabled', 'disabled'));
            if (divDocHumanos) divDocHumanos.classList.add('d-none');
        }
        fnActualizarDocumentoActivo();
    }
    btnHabilitarHumanos.addEventListener('click', () => fnAlternarHumanos(true));
    btnDeshabilitarHumanos.addEventListener('click', () => fnAlternarHumanos(false));
    fnAlternarHumanos(txtHumaAct.checked);
    // --------


    // Formulario
    const formSolicitud = document.getElementById('formSolicitud');

    // Previsualizar Documentos
    async function actualizarPrevisualizacion(tipoDocumento, idIframe, idBtnDescarga = null, idLoader, idVerDocumento = null) {
        const iframe = document.getElementById(idIframe);
        if (!iframe) return;
        const btnDescarga = idBtnDescarga ? document.getElementById(idBtnDescarga) : null;
        iframe.style.opacity = '0.5';
        if (btnDescarga) btnDescarga.classList.add('disabled');
        const formData = new FormData(formSolicitud);
        formData.append('sTipo', tipoDocumento);
        const divVerDocumento = idVerDocumento ? document.getElementById(idVerDocumento) : null;
        if (divVerDocumento) divVerDocumento.classList.add('d-none');
        const urlAction = formSolicitud.getAttribute('data-url-preview');
        const loader = document.getElementById(idLoader);
        if (loader) loader.classList.remove('d-none');

        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const blob = await response.blob();
                const urlBlob = URL.createObjectURL(blob);
                iframe.src = urlBlob + "#toolbar=0";
                if (loader) loader.classList.add('d-none');
                if (divVerDocumento) divVerDocumento.classList.remove('d-none');
                if (btnDescarga) {
                    btnDescarga.href = urlBlob;
                    btnDescarga.download = `Solicitud_${tipoDocumento}_${new Date().toISOString().slice(0, 10)}.pdf`;
                    btnDescarga.classList.remove('disabled');
                }
            } else {
                console.error("Error generando preview");
                if (loader) loader.innerHTML = '<span class="text-danger fw-bold">Error al generar</span>';
            }
        } catch (error) {
            console.error("Error de red:", error);
            if (loader) loader.innerHTML = '<span class="text-danger fw-bold">Error de conexión</span>';
        } finally {
            iframe.style.opacity = '1';
        }
    }

    // --- EVENTOS ---
    const iframe = document.getElementById('iframeViewer');
    const modalPrevisualizar = document.getElementById('mdlPrevisualizarDocumento');
    if (modalPrevisualizar) {
        modalPrevisualizar.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const tipo = button.getAttribute('data-tipo');
            actualizarPrevisualizacion(tipo, 'iframeViewer', 'btnDescargarModal');
            iframe.style.opacity = '0';
        });
        // Opcional: Limpiar al cerrar para que no se quede la URL vieja
        modalPrevisualizar.addEventListener('hidden.bs.modal', function () {
            const btn = document.getElementById('btnDescargarModal');
            if (btn) btn.href = "#";
            document.activeElement.blur();
        });
    }
    if (iframe) {
        iframe.addEventListener('load', () => {
            iframe.style.opacity = '1';
        });
    }

    const mdlGlosarioActividades = document.getElementById('mdlGlosarioActividades');
    if (mdlGlosarioActividades) {
        //mdlGlosarioActividades.addEventListener('show.bs.modal', function (event) {
        //    const button = event.relatedTarget;
        //    const tipo = button.getAttribute('data-tipo');
        //    actualizarPrevisualizacion(tipo, 'iframeViewer', 'btnDescargarModal');
        //    iframe.style.opacity = '0';
        //});
        // Opcional: Limpiar al cerrar para que no se quede la URL vieja
        mdlGlosarioActividades.addEventListener('hidden.bs.modal', function () {
            const btn = document.getElementById('btnGlosarioActividades');
            if (btn) btn.href = "#";
            document.activeElement.blur();
        });
    }

    const tabEls = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabEls.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            const activeTabId = event.target.id;
            if (activeTabId === 'pills-descargar-tab') fnActualizarSolicitudes();
        });
    });

    function fnActualizarSolicitudes() {
        const divDescargarTodo = document.getElementById('divDescargarSolicitudes');
        let bDocumentos = false;
        // if (txtFinaAct.checked) actualizarPrevisualizacion('SPRFM', 'iframeMiniHumanos');
        if (txtFinaAct && txtFinaAct.checked) {
            actualizarPrevisualizacion('FINANZAS', 'iframeMiniFinanzas', 'btnDescargaFinanzas', 'divCargandoFinanzas', 'divVerFinanzas');
            bDocumentos = true;
        }
        if (txtHumaAct && txtHumaAct.checked) {
            actualizarPrevisualizacion('HUMANOS', 'iframeMiniHumanos', 'btnDescargaHumanos', 'divCargandoHumanos', 'divVerHumanos');
            bDocumentos = true;
        }
        if (divDescargarTodo) {
            if (bDocumentos) {
                divDescargarTodo.classList.remove('d-none');
            } else {
                divDescargarTodo.classList.add('d-none');
            }
        }
    }

    // Cargar todos los documentos al iniciar
    document.addEventListener("DOMContentLoaded", () => {
        fnActualizarSolicitudes();
    });

    // Descargar ZIP
    const btnZip = document.getElementById('btnDescargarTodoZip');
    if (btnZip && formSolicitud) {

        btnZip.addEventListener('click', async (e) => {
            e.preventDefault(); // Evitar que recargue o suba la página

            // Feedback visual (Deshabilitar botón y cambiar texto)
            const textoOriginal = btnZip.innerHTML;
            btnZip.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generando ZIP...';
            btnZip.classList.add('disabled');

            // 1. Preparar datos
            const formData = new FormData(formSolicitud);
            const urlZip = formSolicitud.getAttribute('data-url-zip');

            try {
                // 2. Enviar petición POST
                const response = await fetch(urlZip, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // 3. Convertir respuesta a Blob (ZIP)
                    const blob = await response.blob();
                    const urlBlob = URL.createObjectURL(blob);

                    // 4. Crear enlace temporal y hacer clic automático
                    const linkTemp = document.createElement('a');
                    linkTemp.href = urlBlob;
                    // Nombre sugerido (aunque el servidor ya lo manda, esto asegura la extensión)
                    linkTemp.download = `Paquete_Solicitudes_${new Date().getTime()}.zip`;

                    document.body.appendChild(linkTemp);
                    linkTemp.click();
                    document.body.removeChild(linkTemp);

                    // Liberar memoria
                    URL.revokeObjectURL(urlBlob);

                } else {
                    console.error("Error al generar el ZIP");
                    alert("Ocurrió un error al generar el archivo comprimido.");
                }
            } catch (error) {
                console.error("Error de red:", error);
                alert("Error de conexión al intentar descargar.");
            } finally {
                // Restaurar botón
                btnZip.innerHTML = textoOriginal;
                btnZip.classList.remove('disabled');
            }
        });
    }

    const btnAgregar = document.getElementById('btnAgregarPestanaUsuario');
    const containerTabs = document.getElementById('pills-tab-humanos'); // El UL
    const containerContent = document.getElementById('pills-tabContent-humanos'); // El DIV de contenidos
    const msgMax = document.getElementById('msgMaxUsuarios');

    // Templates
    const tmplTab = document.getElementById('tmplTabUsuario');
    const tmplContent = document.getElementById('tmplContentUsuario');

    const MAX_USUARIOS_TOTAL = 10; // 1 Principal + 5 Adicionales

    btnAgregar.addEventListener('click', function () {
        // Contamos cuantos hay actualmente (restando el boton agregar)
        const currentTabs = containerTabs.querySelectorAll('.nav-item').length - 1;

        if (currentTabs < MAX_USUARIOS_TOTAL) {
            crearNuevoUsuario();
        }
    });

    // ... código anterior ...

    function crearNuevoUsuario() {
        const uniqueId = new Date().getTime();

        // 1. Clonar Pestaña (Igual que antes)
        const cloneTab = tmplTab.content.cloneNode(true);
        cloneTab.querySelector('button').id = `tab-user-${uniqueId}`;
        cloneTab.querySelector('button').setAttribute('data-bs-target', `#content-user-${uniqueId}`);
        containerTabs.insertBefore(cloneTab, containerTabs.lastElementChild);

        // 2. Clonar Contenido
        const cloneContent = tmplContent.content.cloneNode(true);
        // Necesitamos una referencia al elemento DOM real, cloneNode devuelve un DocumentFragment
        // Así que lo agregamos y luego lo seleccionamos por ID
        const contentId = `content-user-${uniqueId}`;
        cloneContent.querySelector('.tab-pane').id = contentId;
        containerContent.appendChild(cloneContent);

        // 3. Obtener el elemento recién insertado en el DOM
        const paneElement = document.getElementById(contentId);

        // 4. INICIALIZAR LA BÚSQUEDA PARA ESTA PESTAÑA
        setupBusquedaUsuario(paneElement);

        // 5. Actualizar índices y activar
        actualizarEstadoUsuarios();

        const triggerEl = document.querySelector(`#tab-user-${uniqueId}`);
        const tab = new bootstrap.Tab(triggerEl);
        tab.show();
    }

    // --- FUNCIÓN DE LÓGICA DE BÚSQUEDA ---
    function setupBusquedaUsuario(container) {
        // Selectores dentro de la pestaña actual
        const inputSearch = container.querySelector('.input-search-user');
        const resultsContainer = container.querySelector('.results-container');
        const btnClear = container.querySelector('.btn-clear-search');

        // Referencias a los campos de destino
        const inpNoPer = container.querySelector('.field-noper');
        const inpNombre = container.querySelector('.field-nombre');
        const inpUsuario = container.querySelector('.field-usuario');
        const inpPerfil = container.querySelector('.field-perfil');
        const inpDep = container.querySelector('.field-dep');

        let debounceTimer;

        inputSearch.addEventListener('input', function () {
            const query = this.value.trim();
            const url = this.getAttribute('data-url');

            clearTimeout(debounceTimer);
            resultsContainer.style.display = 'none';

            if (query.length < 3) return;

            debounceTimer = setTimeout(() => {
                // CORRECCIÓN 1: Usamos 'sUsuario' porque así se llama tu parámetro en C#
                fetch(`${url}?sUsuario=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        resultsContainer.innerHTML = '';

                        if (data.length > 0) {
                            data.forEach(user => {
                                const item = document.createElement('a');
                                item.className = 'list-group-item list-group-item-action cursor-pointer';

                                // CORRECCIÓN 2: Usamos 'user.label' que ya viene formateado desde C#
                                // Ejs: "[61399] angel - José Ángel..."
                                //item.innerHTML = `
                                //    <div class="fw-bold small">${user.label}</div>
                                //    <div class="text-muted extra-small" style="font-size:0.75rem;">
                                //        <i class="fa-solid fa-briefcase"></i> ${user.sPueEmpl} |
                                //        <i class="fa-solid fa-building"></i> ${user.sUResNom}
                                //    </div>
                                //`;
                                item.href = "#";
                                item.innerHTML = user.label;

                                item.addEventListener('click', function (e) {
                                    e.preventDefault();

                                    // CORRECCIÓN 3: Mapeo exacto con tu C# (camelCase por defecto en JSON)
                                    if (inpNoPer) inpNoPer.value = user.nNoPer;       // De tu C#: nNoPer
                                    if (inpNombre) inpNombre.value = user.sNomEmpl;   // De tu C#: sNomEmpl
                                    if (inpUsuario) inpUsuario.value = user.nUsrClv;  // De tu C#: nUsrClv
                                    if (inpPerfil) inpPerfil.value = user.sPueEmpl;   // De tu C#: sPueEmpl
                                    if (inpDep) inpDep.value = user.nUResClv;         // De tu C#: nUResClv (Asumo que es la dependencia)

                                    // Limpieza visual
                                    inputSearch.value = '';
                                    resultsContainer.style.display = 'none';
                                });

                                resultsContainer.appendChild(item);
                            });
                            resultsContainer.style.display = 'block';
                        }
                    })
                    .catch(err => console.error("Error buscando usuarios", err));
            }, 300);
        });

        // Botón Limpiar (Resetear campos)
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                inputSearch.value = '';
                // Limpiamos los campos vinculados
                [inpNoPer, inpNombre, inpUsuario, inpPerfil, inpDep].forEach(el => {
                    if (el) el.value = '';
                });
            });
        }

        // Ocultar al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!inputSearch.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    // Delegación para cerrar pestañas
    containerTabs.addEventListener('click', function (e) {
        // CORRECCIÓN: Usamos .closest() para detectar el botón aunque clickees el ícono <i>
        const btnClose = e.target.closest('.btn-cerrar-tab');

        if (btnClose) {
            e.preventDefault();
            e.stopPropagation(); // Evitar que cambie de tab al cerrar

            // Busamos el botón grande (nav-link) que contiene al botón de cerrar
            const tabButton = btnClose.closest('button.nav-link');

            if (!tabButton) return; // Seguridad

            const targetId = tabButton.getAttribute('data-bs-target'); // #content-user-123

            // 1. Eliminar la pestaña completa (el LI padre)
            const liPadre = tabButton.closest('li');
            if (liPadre) liPadre.remove();

            // 2. Eliminar el contenido (DIV con los inputs)
            const contentDiv = document.querySelector(targetId);
            if (contentDiv) contentDiv.remove();

            // 3. Volver al tab principal si borramos el que estaba activo
            if (tabButton.classList.contains('active')) {
                const mainTabEl = document.querySelector('#tab-usuario-main'); // Asegúrate que este ID exista en tu HTML fijo
                if (mainTabEl) {
                    const mainTab = new bootstrap.Tab(mainTabEl);
                    mainTab.show();
                }
            }

            // 4. Reordenar índices
            actualizarEstadoUsuarios();
        }
    });

    function actualizarEstadoUsuarios() {
        // Obtenemos SOLO los items extras (tienen clase .item-usuario-extra)
        const extraTabs = containerTabs.querySelectorAll('.item-usuario-extra');
        const extraContents = containerContent.querySelectorAll('.content-usuario-extra');

        // Controlar visibilidad botón agregar
        // Total = 1 (Principal) + Extras
        if (extraTabs.length + 1 >= MAX_USUARIOS_TOTAL) {
            btnAgregar.parentElement.classList.add('d-none');
            msgMax.classList.remove('d-none');
        } else {
            btnAgregar.parentElement.classList.remove('d-none');
            msgMax.classList.add('d-none');
        }

        // RE-INDEXAR PARA ASP.NET
        // El array en C# LsUsuariosAdicionales debe ser [0], [1], [2]...
        extraContents.forEach((pane, index) => {
            // Actualizar Título Visual (#2, #3...)
            // El usuario principal es el #1, así que el primer extra es index + 2
            const visualNum = index + 2;
            pane.querySelector('.lbl-numero').textContent = visualNum;

            // Actualizar etiqueta en la pestaña correspondiente
            // Asumimos que están en el mismo orden en el DOM
            if (extraTabs[index]) {
                extraTabs[index].querySelector('.lbl-nombre').textContent = `${visualNum}`;
            }

            // Actualizar 'name' de los inputs
            const inputs = pane.querySelectorAll('input, select');
            inputs.forEach(input => {
                // 1. Reemplazar names
                if (input.name) {
                    // Primero reemplazamos el marcador del template
                    input.name = input.name.replace('INDEX_LISTA', index);
                    // Luego aseguramos el reordenamiento si se borraron items
                    input.name = input.name.replace(/LsUsuariosAdicionales\[.*?\]/, `LsUsuariosAdicionales[${index}]`);
                }

                // 2. Reemplazar IDs de Radios (CORRECCIÓN IMPORTANTE)
                if (input.type === 'radio') {
                    // Reemplazamos el marcador RADIO_ID por el índice actual
                    // Ejemplo: MovA_RADIO_ID -> MovA_0_EXTRA
                    const baseId = input.id.split('_')[0]; // Toma 'MovA'
                    const newId = `${baseId}_${index}_EXTRA`;

                    input.id = newId;

                    // Actualizamos el 'for' del label para que al dar click al texto funcione
                    const label = input.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        label.setAttribute('for', newId);
                    }
                }
            });
        });
    }
});