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

    //const btnManual = document.getElementById('btnManual');

    // Busqueda de usuario
    const txtBuscarUsuario = document.getElementById('txtBuscarUsuario');
    const divResultados = document.getElementById('divResultadosBusqueda');

    // Referencias a los inputs del formulario (Usamos los IDs generados por asp-for)
    const lsInputs = {
        sNomEmpl: document.getElementById('SNomEmpl'),
        nNoPer: document.getElementById('NNoPer'),
        sUsuario: document.getElementById('SUsuario'),
        sCorreo: document.getElementById('SCorreo'),
        nUResClv: document.getElementById('NUResClv'),
        sUResNom: document.getElementById('SUResNom'),
        Region: document.getElementById('Region'),
        sPueEmpl: document.getElementById('SPueEmpl')
    };

    console.log(Region.value)

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
                        //item.classList.add('dropdown-item', 'cursor-pointer');
                        //item.textContent = emp.label;
                        item.className = 'list-group-item list-group-item-action cursor-pointer';
                        item.innerHTML = `<span class="fw-bold text-primary">${emp.nNoPer}</span> - <small>${emp.sNomEmpl}</small>`;
                        item.href = "#";

                        // Evento Click en un resultado
                        item.addEventListener('click', async function (e) {
                            e.preventDefault();
                            fnRellenarDatos(emp);
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

    // EVENTO PARA CERRAR AL DAR CLICK AFUERA
    document.addEventListener('click', function (e) {
        // 1. Verificamos que los elementos existan para evitar errores
        if (!txtBuscarUsuario || !divResultados) return;

        // 2. La Lógica: ¿El click fue FUERA del input Y FUERA de los resultados?
        const clickEnInput = txtBuscarUsuario.contains(e.target);
        const clickEnResultados = divResultados.contains(e.target);

        if (!clickEnInput && !clickEnResultados) {
            // Ocultamos
            divResultados.classList.remove('show');
            // Opcional: Limpiar resultados para que no reaparezcan viejos al volver a dar click
            // divResultados.innerHTML = ''; 
        }
    });

    // --- 2. FUNCIÓN: RELLENAR DATOS (Autocompletado) ---
    function fnRellenarDatos(emp) {
        if (!emp) return;

        console.log(emp)

        // Validamos con 'if' por seguridad
        if (lsInputs.sNomEmpl) lsInputs.sNomEmpl.value = emp.sNomEmpl || '';
        if (lsInputs.nNoPer) lsInputs.nNoPer.value = emp.nNoPer || '';
        if (lsInputs.sUsuario) lsInputs.sUsuario.value = emp.sUsuario || '';
        if (lsInputs.sCorreo) lsInputs.sCorreo.value = emp.sCorreo || '';
        if (lsInputs.nUResClv) lsInputs.nUResClv.value = emp.nUResClv || '';
        if (lsInputs.sUResNom) lsInputs.sUResNom.value = emp.sUResNom || '';

        // Region es un select, asignamos valor si coincide
        if (lsInputs.Region) lsInputs.Region.value = emp.region;
        console.log(lsInputs.Region.value)

        // Mapeamos el Puesto (que viene del backend como sPueEmpl o sPerfil)
        if (lsInputs.sPueEmpl) lsInputs.sPueEmpl.value = emp.sPueEmpl || '';

        // Asegurar que sigan bloqueados (Solo lectura) para evitar errores manuales
        // (Asegúrate de tener la función bloquearCampos definida o descomentada)
        //if (typeof bloquearCampos === "function") {
        //    bloquearCampos(true);
        //}
    }

    // --- 3. FUNCIÓN: MODO MANUAL (Desbloquear) ---
    //btnManual.addEventListener('click', function (e) {
    //    e.preventDefault(); // Evitar que el botón haga submit si está dentro de un form

    //    // Limpiar campos (opcional, si quieres que escriban desde cero)
    //    // O puedes dejarlos con los datos actuales para editar sobre ellos.

    //    //bloquearCampos(false); // Desbloquear todo

    //    // Dar foco al primer campo
    //    lsInputs.sNomEmpl.focus();
    //});

    // --- AUXILIAR: BLOQUEAR / DESBLOQUEAR ---
    //function bloquearCampos(bloquear) {
    //    Object.values(lsInputs).forEach(el => {
    //        if (bloquear) {
    //            // MODO BLOQUEADO
    //            el.setAttribute('readonly', true);
    //            if (el.tagName === 'SELECT') el.setAttribute('disabled', true);

    //            el.classList.add('bg-light');
    //            el.classList.remove('bg-white');
    //        } else {
    //            // MODO EDITABLE
    //            el.removeAttribute('readonly');
    //            if (el.tagName === 'SELECT') el.removeAttribute('disabled');

    //            el.classList.remove('bg-light');
    //            el.classList.add('bg-white');
    //        }
    //    });
    //}
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
                    btnDescarga.download = `Solicitud_${tipoDocumento}_${
                        new Date().toISOString()
                            .replace('T', '_')
                            .replace('Z', '')
                            .replace(/[:.]/g, '-')
                        }.pdf`;
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
            actualizarPrevisualizacion('Finanzas', 'iframeMiniFinanzas', 'btnDescargaFinanzas', 'divCargandoFinanzas', 'divVerFinanzas');
            bDocumentos = true;
        }
        if (txtHumaAct && txtHumaAct.checked) {
            actualizarPrevisualizacion('Humanos', 'iframeMiniHumanos', 'btnDescargaHumanos', 'divCargandoHumanos', 'divVerHumanos');
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
                                // item.innerHTML = user.label;
                                item.innerHTML = `<span class="fw-bold text-primary">${user.nNoPer}</span> - <small>${user.sNomEmpl}</small>`;
                                item.href = "#";

                                item.addEventListener('click', function (e) {
                                    e.preventDefault();

                                    // CORRECCIÓN 3: Mapeo exacto con tu C# (camelCase por defecto en JSON)
                                    if (inpNoPer) inpNoPer.value = user.nNoPer;       // De tu C#: nNoPer
                                    if (inpNombre) inpNombre.value = user.sNomEmpl;   // De tu C#: sNomEmpl
                                    if (inpUsuario) inpUsuario.value = user.sUsuario;  // De tu C#: nUsrClv
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

        // RE-INDEXAR PARA ASP.NET (Es crucial para que el Model Binding funcione)
        // El array en C# MoHumanos.LsHumaAdi debe ser [0], [1], [2]... sin saltos
        extraContents.forEach((pane, index) => {

            // 1. Actualizar Título Visual (#2, #3...)
            // El usuario principal es el #1, así que el primer extra es index + 2
            const visualNum = index + 2;
            const lblNum = pane.querySelector('.lbl-numero');
            if (lblNum) lblNum.textContent = visualNum;

            // 2. Actualizar etiqueta en la pestaña correspondiente
            if (extraTabs[index]) {
                const lblNombre = extraTabs[index].querySelector('.lbl-nombre');
                if (lblNombre) lblNombre.textContent = `#${visualNum}`; // O "Usuario Nuevo" si prefieres mantenerlo así
            }

            // 3. Actualizar 'name' e 'id' de los inputs
            const inputs = pane.querySelectorAll('input, select');

            inputs.forEach(input => {
                // A) ACTUALIZAR NAME (CORRECCIÓN CRÍTICA)
                if (input.name) {
                    // Esta expresión regular busca cualquier variación del nombre de la lista:
                    // 1. LsUsuariosAdicionales[INDEX_LISTA] (Del template original)
                    // 2. LsUsuariosAdicionales[0] (Si ya se había guardado antes)
                    // 3. MoHumanos.LsHumaAdi[0] (La estructura nueva)

                    // Reemplazamos CUALQUIERA de esos patrones por: MoHumanos.LsHumaAdi[INDICE_ACTUAL]
                    input.name = input.name.replace(
                        /(LsUsuariosAdicionales|MoHumanos\.LsHumaAdi)\[.*?\]|LsUsuariosAdicionales\[INDEX_LISTA\]/,
                        `MoHumanos.LsHumaAdi[${index}]`
                    );
                }

                // B) ACTUALIZAR IDs DE RADIO BUTTONS (Para que el click en label funcione)
                if (input.type === 'radio' && input.id) {
                    // Obtenemos la base del ID (ej: "MovA") quitando sufijos previos
                    // Asumimos que el ID base no tiene guiones bajos, o tomamos la primera parte
                    const baseId = input.id.split('_')[0];

                    // Generamos ID único: MovA_0_EXTRA
                    const newId = `${baseId}_${index}_EXTRA`;

                    input.id = newId;

                    // Buscar el label asociado (generalmente es el siguiente hermano) y actualizar su 'for'
                    const label = input.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        label.setAttribute('for', newId);
                    }
                }
            });
        });
    }

    // ==========================================
    // LOGICA DE NAVEGACIÓN (ANTERIOR / SIGUIENTE)
    // ==========================================

    // 1. OBTENER REFERENCIAS (Asegúrate que los IDs en HTML coincidan)
    // Si en tu HTML se llaman 'btnStepAnterior', cámbialo aquí.
    const btnAnterior = document.getElementById('btnAnterior') || document.getElementById('btnStepAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente') || document.getElementById('btnStepSiguiente');

    // Validación de seguridad: Si no existen los botones, no hacemos nada para evitar errores
    if (!btnAnterior || !btnSiguiente) return;

    // 2. SELECTOR ESTRICTO: Solo hijos directos (#pills-tab > li > button)
    // Esto evita contar pestañas internas de otros módulos
    const listaTabs = Array.from(document.querySelectorAll('#pills-tab > li > button[data-bs-toggle="pill"]'));

    // 3. FUNCIÓN DE ACTUALIZACIÓN VISUAL
    function fnActualizarBotonesNav() {
        // Buscamos cuál es el tab activo actualmente
        const tabActivo = document.querySelector('#pills-tab > li > button.active');

        if (!tabActivo) return;

        const indexActual = listaTabs.indexOf(tabActivo);
        const totalTabs = listaTabs.length; // Dinámico (debería ser 4)

        // --- CONFIGURAR BOTÓN ANTERIOR ---
        if (indexActual === 0) {
            // Estamos en el inicio -> Ocultar Anterior
            btnAnterior.classList.add('d-none');
        } else {
            // Mostrar Anterior
            btnAnterior.classList.remove('d-none');
        }

        // --- CONFIGURAR BOTÓN SIGUIENTE ---
        if (indexActual === totalTabs - 1) {
            // Estamos en el final -> Ocultar Siguiente
            btnSiguiente.classList.add('d-none');
            btnSiguiente.classList.remove('d-flex'); // IMPORTANTE: Quitar d-flex si existe para asegurar que se oculte
        } else {
            // Mostrar Siguiente
            btnSiguiente.classList.remove('d-none');
            // btnSiguiente.classList.add('d-flex'); // Opcional: restaurar si tu diseño lo requiere
        }
    }

    // 4. EVENTOS CLICK (BOTONES INFERIORES)

    btnSiguiente.addEventListener('click', function () {
        const tabActivo = document.querySelector('#pills-tab > li > button.active');
        const indexActual = listaTabs.indexOf(tabActivo);
        const siguienteIndex = indexActual + 1;

        if (siguienteIndex < listaTabs.length) {
            const tabBootstrap = new bootstrap.Tab(listaTabs[siguienteIndex]);
            tabBootstrap.show();
        }
    });

    btnAnterior.addEventListener('click', function () {
        const tabActivo = document.querySelector('#pills-tab > li > button.active');
        const indexActual = listaTabs.indexOf(tabActivo);
        const anteriorIndex = indexActual - 1;

        if (anteriorIndex >= 0) {
            const tabBootstrap = new bootstrap.Tab(listaTabs[anteriorIndex]);
            tabBootstrap.show();
        }
    });

    // 5. EVENTO AUTOMÁTICO (SINCRONIZACIÓN)
    // Detecta cambios hechos por clic en el menú superior o por los botones de abajo
    listaTabs.forEach(tabBtn => {
        tabBtn.addEventListener('shown.bs.tab', function () {
            // Actualizamos visibilidad de botones
            fnActualizarBotonesNav();

            // Llamada a funciones externas si existen
            if (typeof fnActualizarSolicitudes === 'function') {
                fnActualizarSolicitudes();
            }
        });
    });

    // 6. INICIALIZAR AL CARGAR
    // Ejecutamos una vez para asegurar que el botón "Anterior" esté oculto al principio
    fnActualizarBotonesNav();

    // ==========================================
    // BUSCADOR DE DEPENDENCIA / ENTIDAD
    // ==========================================

    const txtBuscarEntidad = document.getElementById('txtBuscarEntidad');
    const listaResultados = document.getElementById('lista-resultados-entidad');

    // Contenedores visuales
    const containerBuscar = document.getElementById('container-buscar-entidad');
    const containerSeleccionado = document.getElementById('container-entidad-seleccionada');

    // Elementos de la selección
    const lblEntidadTexto = document.getElementById('lblEntidadTexto');
    const btnQuitarEntidad = document.getElementById('btnQuitarEntidad');

    // Inputs ocultos (binding con ASP.NET Core)
    const hdnEntClv = document.getElementById('hdnEntClv');
    const hdnEntNom = document.getElementById('hdnEntNom');

    let debounceEntidad; // Para controlar el tiempo de espera al escribir

    // --- 1. EVENTO DE BÚSQUEDA (Mientras el usuario escribe) ---
    if (txtBuscarEntidad) {
        txtBuscarEntidad.addEventListener('input', function () {
            const query = this.value.trim();
            const url = this.getAttribute('data-url'); // Lee la URL del atributo HTML

            // Limpiamos temporizador anterior y ocultamos lista para reiniciar
            clearTimeout(debounceEntidad);
            listaResultados.style.display = 'none';

            // Si hay menos de 3 caracteres, no hacemos nada
            if (query.length < 3) return;

            // Esperar 300ms antes de llamar al servidor (Debounce)
            debounceEntidad = setTimeout(() => {
                fetch(`${url}?sTermino=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        listaResultados.innerHTML = '';

                        if (data.length > 0) {
                            data.forEach(item => {
                                // NOTA: ASP.NET convierte las propiedades a minúscula inicial (camelCase)
                                // SCodigo -> sCodigo | SDependencia -> sDependencia
                                const codigo = item.sCodigo || item.SCodigo;
                                const nombre = item.sDependencia || item.SDependencia;

                                // Crear elemento visual de la lista
                                const a = document.createElement('a');
                                a.className = 'list-group-item list-group-item-action cursor-pointer';
                                a.innerHTML = `<span class="fw-bold text-primary">${codigo}</span> - <small>${nombre}</small>`;
                                a.href = "#";

                                // Evento al seleccionar una opción
                                a.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    fnSeleccionarEntidad(codigo, nombre);
                                });

                                listaResultados.appendChild(a);
                            });
                            listaResultados.style.display = 'block';
                        } else {
                            listaResultados.innerHTML = '<div class="list-group-item text-muted small">No se encontraron resultados</div>';
                            listaResultados.style.display = 'block';
                        }
                    })
                    .catch(err => console.error("Error buscando dependencia:", err));
            }, 300);
        });
    }

    // --- 2. FUNCIÓN: SELECCIONAR UNA ENTIDAD ---
    function fnSeleccionarEntidad(clave, nombre) {
        // 1. Llenar inputs ocultos (Lo que se guarda en BD)
        if (hdnEntClv) hdnEntClv.value = clave;
        if (hdnEntNom) hdnEntNom.value = nombre;

        // 2. Actualizar texto visual
        if (lblEntidadTexto) lblEntidadTexto.textContent = `${clave} - ${nombre}`;

        // 3. Cambiar estado visual: Ocultar buscador, Mostrar seleccionado
        if (listaResultados) listaResultados.style.display = 'none';
        if (containerBuscar) containerBuscar.classList.add('d-none');

        if (containerSeleccionado) {
            containerSeleccionado.classList.remove('d-none');
            containerSeleccionado.classList.add('d-flex');
        }
    }

    // --- 3. FUNCIÓN: QUITAR / ELIMINAR SELECCIÓN ---
    if (btnQuitarEntidad) {
        btnQuitarEntidad.addEventListener('click', function () {
            // 1. Limpiar inputs ocultos
            if (hdnEntClv) hdnEntClv.value = '';
            if (hdnEntNom) hdnEntNom.value = '';

            // 2. Limpiar input visual
            if (txtBuscarEntidad) txtBuscarEntidad.value = '';

            // 3. Cambiar estado visual: Ocultar seleccionado, Mostrar buscador
            if (containerSeleccionado) {
                containerSeleccionado.classList.add('d-none');
                containerSeleccionado.classList.remove('d-flex');
            }

            if (containerBuscar) containerBuscar.classList.remove('d-none');

            // 4. Poner foco para escribir de nuevo
            setTimeout(() => txtBuscarEntidad.focus(), 100);
        });
    }

    // --- 4. CERRAR LISTA AL DAR CLIC FUERA ---
    document.addEventListener('click', function (e) {
        // Si el clic NO fue dentro del contenedor del buscador, cerramos la lista
        if (containerBuscar && !containerBuscar.contains(e.target)) {
            listaResultados.style.display = 'none';
        }
    });
});