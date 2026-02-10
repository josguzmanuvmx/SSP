document.addEventListener("DOMContentLoaded", function () {

    // Activar botones tooltip para Todos los Permisos en Finanzas
    var lsTooltip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    lsTooltip.map(function (tooltip) {
        return new bootstrap.Tooltip(tooltip, {
            animation: true,
            delay: { "show": 100, "hide": 100 }
        })
    });

    // Checkboxes Especiales para Alternar Detalles en Finanzas
    const lsDivAlternarDetalle = document.querySelectorAll('.clsAlternarDetalle');
    lsDivAlternarDetalle.forEach(txtDetalle => {
        const fnAlternarDetalle = (bMarcado) => {
            const txtId = txtDetalle.getAttribute('data-target');
            const txtDiv = document.querySelector(txtId);
            const txtArea = txtDiv.querySelector('textarea');

            if (bMarcado) {
                txtDiv.classList.remove('d-none');
                txtArea.setAttribute('required', 'required');
                setTimeout(() => txtArea.focus(), 100);
            } else {
                txtDiv.classList.add('d-none');
                txtArea.removeAttribute('required');
                txtArea.value = '';
            }
            if (formSolicitud) formSolicitud.dispatchEvent(new Event('input'));
        };
        txtDetalle.addEventListener('change', function () {
            fnAlternarDetalle(this.checked);
        });
        if (txtDetalle.checked) {
            fnAlternarDetalle(true);
        }
    });

    // Lista Catalogo de Dependencias
    const lsCatalogoDependencias = window.datosDependencias || [];

    // Tabla Glosario de Actividades
    var nTamPag = parseInt($('#ddlActividades').val(), 10) || 10;
    var tblActividades = $('#tblActividades').DataTable({
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
        autoWidth: false
    });

    // Metodo para limpiar el texto
    function fnsLimpiarTexto(sTexto) {
        if (!sTexto) return "";
        return sTexto
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

    // ============================
    // FORMULARIO GUARDARSOLICITUD
    // ============================
    const btnGuardar = document.getElementById('btnGuardar');

    btnGuardar.addEventListener('click', async function () {
        const btn = this;

        const textoOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
        const form = document.getElementById('formSolicitud');
        const formData = new FormData(form);
        const urlAction = form.getAttribute('data-url-guardar') || form.action;
        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('¡Éxito!', result.message, 'success').then(() => {
                        window.location.href = '/Inicio';
                    });
                } else {
                    window.location.reload();
                }
            } else {
                // Error de lógica (validación)
                let msg = result.message;
                if (result.errors) msg += "\n" + result.errors.join("\n");
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Restaurar botón siempre
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
        }
    });
    // ----------

    // Referencias a los inputs del formulario (Usamos los IDs generados por asp-for)
    const lsTxtUsuario = {
        sNomEmpl: document.getElementById('SNomEmpl'),
        nNoPer: document.getElementById('NNoPer'),
        sUsuario: document.getElementById('SUsuario'),
        sCorreo: document.getElementById('SCorreo'),
        Region: document.getElementById('Region'),
        sPueEmpl: document.getElementById('SPueEmpl'),
    };

    // ====================
    // BUSQUEDA DE USUARIO
    // ====================
    function fnActualizarSeleccionUsuario(lsItems, idUsuario) {
        lsItems.forEach(item => item.classList.remove('active'));
        if (idUsuario > -1 && lsItems[idUsuario]) {
            const itemActivo = lsItems[idUsuario];
            itemActivo.classList.add('active');
            itemActivo.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    function fnRellenarDatos(emp) {
        if (!emp) return;
        if (lsTxtUsuario.sNomEmpl) lsTxtUsuario.sNomEmpl.value = emp.sNomEmpl || '';
        if (lsTxtUsuario.nNoPer) lsTxtUsuario.nNoPer.value = emp.nNoPer || '';
        if (lsTxtUsuario.sUsuario) lsTxtUsuario.sUsuario.value = emp.sUsuario || '';
        if (lsTxtUsuario.sCorreo) lsTxtUsuario.sCorreo.value = emp.sCorreo || '';
        if (lsTxtUsuario.sPueEmpl) lsTxtUsuario.sPueEmpl.value = emp.sPueEmpl || '';
    }
    function fnBuscarUsuario(sUsuario, sResultados, divHumaContainer = null) {
        let debounceTimer;
        let idUsuario = -1;
        // R. HUMANOS
        let txtHumanosNoPer;
        let txtHumanosNomEmpl;
        let txtHumanosUsuario;
        let btnHumaManual;
        let txtUsuario;
        let divResultados;
        if (divHumaContainer) {
            txtHumanosNoPer = divHumaContainer.querySelector('.txtNoPer');
            txtHumanosNomEmpl = divHumaContainer.querySelector('.txtNomEmpl');
            txtHumanosUsuario = divHumaContainer.querySelector('.txtHumaUsuario');

            txtUsuario = divHumaContainer.querySelector(sUsuario)
            divResultados = divHumaContainer.querySelector(sResultados)

            btnHumaManual = divHumaContainer.querySelector('.btnHumaManual');
            btnHumaManual.addEventListener('click', function (e) {
                e.preventDefault();

                const txtUsrs = [txtHumanosNoPer, txtHumanosNomEmpl, txtHumanosUsuario];
                txtUsrs.forEach(txtUsr => {
                    txtUsr.classList.remove('pe-none');
                    txtUsr.removeAttribute('readonly');
                    if (txtUsr.tagName === 'SELECT') txtUsr.removeAttribute('disabled');
                    txtUsr.classList.remove('bg-light');
                    txtUsr.classList.add('bg-white');
                });

                lsTxtUsuario.sNomEmpl.focus();
            });
        } else {
            txtUsuario = document.getElementById(sUsuario);
            divResultados = document.getElementById(sResultados);
        }
        if (txtUsuario && divResultados) {
            txtUsuario.addEventListener('keydown', function (e) {
                const lsItems = divResultados.querySelectorAll('a.list-group-item');
                if (divResultados.style.display === 'none' || lsItems.length === 0) return;
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    idUsuario++;
                    if (idUsuario >= lsItems.length) idUsuario = 0;
                    fnActualizarSeleccionUsuario(lsItems, idUsuario);
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    idUsuario--;
                    if (idUsuario < 0) idUsuario = lsItems.length - 1;
                    fnActualizarSeleccionUsuario(lsItems, idUsuario);
                }
                else if (e.key === 'Enter') {
                    if (idUsuario > -1) {
                        e.preventDefault();
                        lsItems[idUsuario].click();
                    }
                }
                else if (e.key === 'Escape') {
                    divResultados.style.display = 'none';
                    idUsuario = -1;
                }
            });
            txtUsuario.addEventListener('input', async function () {
                const sBusqueda = this.value;
                const sUrlBusqueda = this.getAttribute('data-url');
                clearTimeout(debounceTimer);
                divResultados.innerHTML = '';
                if (sBusqueda.length < 3) { return; }
                debounceTimer = setTimeout(() => {
                    fetch(`${sUrlBusqueda}?sUsuario=${sBusqueda}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                data.forEach(moUsr => {
                                    const aUsr = document.createElement('a');
                                    aUsr.className = 'list-group-item list-group-item-action cursor-pointer';
                                    aUsr.innerHTML = `<span class="codigo fw-semibold">${moUsr.nNoPer}</span> <span class="dep mx-1">-</span> <span>${moUsr.sNomEmpl}</span>`;
                                    aUsr.href = "#";
                                    aUsr.addEventListener('click', async function (e) {
                                        e.preventDefault();
                                        if (divHumaContainer) {
                                            if (txtHumanosNoPer) { txtHumanosNoPer.value = moUsr.nNoPer }
                                            if (txtHumanosNomEmpl) { txtHumanosNomEmpl.value = moUsr.sNomEmpl }
                                            if (txtHumanosUsuario) { txtHumanosUsuario.value = moUsr.sUsuario }
                                        } else {
                                            fnRellenarDatos(moUsr);
                                        }
                                        txtUsuario.value = '';
                                        divResultados.style.display = 'none';
                                    });
                                    divResultados.appendChild(aUsr);
                                });
                                divResultados.style.display = 'block';
                            } else {
                                divResultados.innerHTML = '<div class="list-group-item text-muted small fst-italic p-2">No hay coincidencias</div>';
                                divResultados.style.display = 'block';
                            }
                        })
                        .catch (err => console.error("Error buscando usuarios", err));
                }, 300);
                idUsuario = -1;
            });
        }
        document.addEventListener('click', function (e) {
            if (!txtUsuario || !divResultados) return;
            if (!txtUsuario.contains(e.target) && !divResultados.contains(e.target)) {
                divResultados.style.display = 'none';
            }
        });
    }
    fnBuscarUsuario('txtUsuario', 'divResultados')


    // ============================================
    // BOTON MANUAL PARA INGRESAR DATOS EN USUARIO
    // ============================================
    function fnBloquearCampos(bBloqueado) {
        Object.values(lsTxtUsuario).forEach(txtUsr => {
            if (bBloqueado) {
                txtUsr.classList.add('pe-none')
                txtUsr.setAttribute('readonly', true);
                if (txtUsr.tagName === 'SELECT') txtUsr.setAttribute('disabled', true);
                txtUsr.classList.add('bg-light');
                txtUsr.classList.remove('bg-white');
            } else {
                txtUsr.classList.remove('pe-none')
                txtUsr.removeAttribute('readonly');
                if (txtUsr.tagName === 'SELECT') txtUsr.removeAttribute('disabled');
                txtUsr.classList.remove('bg-light');
                txtUsr.classList.add('bg-white');
            }
        });
    }
    const btnManual = document.getElementById('btnManual');
    btnManual.addEventListener('click', function (e) {
        e.preventDefault();
        fnBloquearCampos(false);
        lsTxtUsuario.sNomEmpl.focus();
    });
    

    // ============
    // SOLICITUDES
    // ============
    const divSinDocumentos = document.getElementById('divSinDocumentos');
    const divDescargarSolicitudes = document.getElementById('divDescargarSolicitudes');
    function fnActualizarDocumentoActivo() {
        const txtEstuAct = document.getElementById('txtEstuAct');
        const txtFinaAct = document.getElementById('txtFinaAct');
        const txtHumaAct = document.getElementById('txtHumaAct');
        const bDocActivo = (txtHumaAct?.checked) || (txtFinaAct?.checked) || (txtEstuAct?.checked);

        if (bDocActivo) {
            divSinDocumentos.classList.add('d-none');
            divDescargarSolicitudes.classList.remove('d-none');
        } else {
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
        const divVerDocumento = idVerDocumento ? document.getElementById(idVerDocumento) : null;
        const loader = document.getElementById(idLoader);
        const urlAction = formSolicitud.getAttribute('data-url-preview');

        // 1. PREPARACIÓN DE UI
        iframe.style.opacity = '0.5';
        if (btnDescarga) btnDescarga.classList.add('disabled');
        if (divVerDocumento) divVerDocumento.classList.add('d-none');

        // --- CORRECCIÓN AQUÍ ---
        // Reiniciamos el contenido del loader al Spinner original antes de mostrarlo
        if (loader) {
            loader.innerHTML = `
            <div class="spinner-border text-secondary mb-2" role="status"></div>
            <small class="text-muted fw-bold">Generando vista previa...</small>
        `;
            loader.classList.remove('d-none');
        }
        // -----------------------

        const formData = new FormData(formSolicitud);
        formData.append('sTipo', tipoDocumento);

        // if (loader) loader.classList.add('d-none');

        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const urlBlob = URL.createObjectURL(blob);

                // Usamos el evento onload para ocultar el loader solo cuando el PDF ya se pintó
                iframe.onload = function () {
                    if (loader) loader.classList.add('d-none');
                    if (divVerDocumento) divVerDocumento.classList.remove('d-none');
                    iframe.style.opacity = '1'; // Restaurar opacidad aquí
                };

                iframe.src = urlBlob + "#toolbar=0";

                if (btnDescarga) {
                    btnDescarga.href = urlBlob;
                    // Generar nombre de archivo limpio
                    const fecha = new Date().toISOString().split('T')[0];
                    btnDescarga.download = `Solicitud_${tipoDocumento}_${fecha}.pdf`;
                    btnDescarga.classList.remove('disabled');
                }
            } else {
                console.error("Error generando preview");
                if (loader) loader.innerHTML = '<span class="text-danger fw-bold"><i class="fa-solid fa-circle-exclamation"></i> Error al generar</span>';
                iframe.style.opacity = '1';
            }
        } catch (error) {
            console.error("Error de red:", error);
            if (loader) loader.innerHTML = '<span class="text-danger fw-bold"><i class="fa-solid fa-wifi"></i> Error de conexión</span>';
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
            if (activeTabId === 'divDescargar') fnActualizarSolicitudes();
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
        // setupBusquedaUsuario(paneElement);
        fnBuscarUsuario('.txtUsuario', '.divResultados', paneElement)

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

        let indiceNavegacionExtra = -1;

        if (inputSearch && resultsContainer) {
            inputSearch.addEventListener('keydown', function (e) {
                const items = resultsContainer.querySelectorAll('a.list-group-item');

                // Si la lista está oculta o vacía, no hacemos nada
                if (resultsContainer.style.display === 'none' || items.length === 0) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault(); // Evita que el cursor se mueva en el input
                    indiceNavegacionExtra++;

                    // Si pasamos el último, volvemos al primero (carrusel)
                    if (indiceNavegacionExtra >= items.length) indiceNavegacionExtra = 0;

                    actualizarSeleccionVisual(items);
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    indiceNavegacionExtra--;

                    // Si subimos más allá del primero, vamos al último
                    if (indiceNavegacionExtra < 0) indiceNavegacionExtra = items.length - 1;

                    actualizarSeleccionVisual(items);
                }
                else if (e.key === 'Enter') {
                    // Si hay algo seleccionado con las flechas, simulamos el click
                    if (indiceNavegacionExtra > -1) {
                        e.preventDefault(); // Evita el submit del formulario
                        items[indiceNavegacionExtra].click();
                    }
                }
                else if (e.key === 'Escape') {
                    resultsContainer.style.display = 'none';
                    indiceNavegacionExtra = -1;
                }
            });

            // --- 2. FUNCIÓN PARA PINTAR EL ELEMENTO SELECCIONADO ---
            function actualizarSeleccionVisual(items) {
                // Limpiar clase 'active' de todos
                items.forEach(item => item.classList.remove('active'));

                // Agregar clase 'active' al actual
                if (indiceNavegacionExtra > -1 && items[indiceNavegacionExtra]) {
                    const itemActivo = items[indiceNavegacionExtra];
                    itemActivo.classList.add('active');

                    // SCROLL AUTOMÁTICO:
                    // Esto asegura que si bajas mucho, la lista haga scroll para mostrarte el item
                    itemActivo.scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }
            }

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
                                    item.innerHTML = `<span class="fw-bold">${user.nNoPer}</span> - <small>${user.sNomEmpl}</small>`;
                                    item.innerHTML = `<span class="codigo fw-semibold">${user.nNoPer}</span> <span class="dep mx-1">-</span> <span>${user.sNomEmpl}</span>`;
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
                            } else {
                                resultsContainer.innerHTML = '<div class="list-group-item text-muted small fst-italic p-2">No hay coincidencias</div>';
                                resultsContainer.style.display = 'block';
                            }
                        })
                        .catch(err => console.error("Error buscando usuarios", err));
                }, 300);

                // IMPORTANTE: Cuando el usuario escribe algo nuevo, reseteamos el índice
                indiceNavegacionExtra = -1;
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
    const listaTabs = Array.from(document.querySelectorAll('#ulSolicitud > li > button[data-bs-toggle="pill"]'));

    // 3. FUNCIÓN DE ACTUALIZACIÓN VISUAL
    function fnActualizarBotonesNav() {
        // Buscamos cuál es el tab activo actualmente
        const tabActivo = document.querySelector('#ulSolicitud > li > button.active');

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

    // --- FUNCIÓN DE VALIDACIÓN POR PESTAÑA ---
    function validarPasoActual(tabButtonMain) {
        // 1. Identificar el contenedor principal (ej. #pills-permisos)
        const targetIdMain = tabButtonMain.getAttribute('data-bs-target');
        const contentDivMain = document.querySelector(targetIdMain);

        // --- LIMPIEZA DE ICONOS PREVIOS ---

        // A. Quitar icono del tab PRINCIPAL (Arriba)
        const iconMain = tabButtonMain.querySelector('.icon-error-tab');
        if (iconMain) iconMain.remove();

        // B. Quitar iconos de los SUB-TABS (Estudiantes, Finanzas, Humanos)
        const subTabButtons = contentDivMain.querySelectorAll('button[data-bs-toggle="pill"]');
        subTabButtons.forEach(btn => {
            const icon = btn.querySelector('.icon-error-tab');
            if (icon) icon.remove();
        });

        // --- VALIDACIÓN DE INPUTS ---

        const inputs = contentDivMain.querySelectorAll('input, select, textarea');
        let esValido = true;
        let primerInvalido = null;

        inputs.forEach(input => {
            // 1. FILTRO DE SECCIÓN ACTIVA
            if (input.closest('#divEstudiantes')) {
                const chk = document.getElementById('txtEstuAct');
                if (chk && !chk.checked) return;
            }
            if (input.closest('#divFinanzas')) {
                const chk = document.getElementById('txtFinaAct');
                if (chk && !chk.checked) return;
            }
            if (input.closest('#divHumanos')) {
                const chk = document.getElementById('txtHumaAct');
                if (chk && !chk.checked) return;
            }

            // Si un input es hidden pero tiene 'required', dejamos que el código siga para validarlo manualmente.
            if (input.type === 'hidden' && !input.hasAttribute('required')) return;

            // Ignorar botones o submits
            if (input.type === 'button' || input.type === 'submit') return;

            let tieneError = false;

            // 1. VALIDACIÓN ESTÁNDAR (Lo que dice el navegador)
            // Nota: checkValidity() devuelve TRUE si el elemento está oculto (display:none), por eso necesitamos el paso 2.
            if (!input.checkValidity()) {
                tieneError = true;
            }

            // 2. VALIDACIÓN MANUAL FORZADA (Para pestañas ocultas y campos readonly)
            // Si es REQUERIDO y está VACÍO, es error (aunque esté oculto en otra pestaña)
            if (input.hasAttribute('required')) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    // Para radios/checkbox es más complejo verificar grupos, pero checkValidity suele funcionar bien.
                } else {
                    // Para textos, selects, números, fechas...
                    if (!input.value || input.value.trim() === '') {
                        tieneError = true;
                    }
                }
            }

            // 3. Validación Selects Deshabilitados
            if (input.tagName === 'SELECT' && input.hasAttribute('disabled')) {
                if (!input.value || input.value === '') tieneError = true;
            }

            // --- PROCESAR RESULTADO ---
            if (tieneError) {
                esValido = false;

                // Marcar visualmente el input (Solo se verá si el tab está activo)
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');

                if (!primerInvalido) primerInvalido = input;

                // --- MAGIA: MARCAR EL SUB-TAB CORRESPONDIENTE ---

                // a. Buscamos el panel donde vive este input (ej: id="pills-finanzas")
                const parentPane = input.closest('.tab-pane');

                // b. Aseguramos que encontramos un panel y que NO es el panel principal (#pills-permisos)
                if (parentPane && parentPane.id !== targetIdMain.replace('#', '')) {

                    // c. Buscamos el botón que controla este panel específico
                    // El selector busca un botón dentro del área actual que apunte a ese ID
                    const subBtn = contentDivMain.querySelector(`button[data-bs-target="#${parentPane.id}"]`);

                    if (subBtn) {
                        // d. Agregamos el icono si no lo tiene ya
                        if (!subBtn.querySelector('.icon-error-tab')) {
                            const iconoHtml = '<i class="fa-solid fa-circle-exclamation text-danger ms-2 icon-error-tab"></i>';
                            subBtn.insertAdjacentHTML('beforeend', iconoHtml);
                        }
                    }
                }

            } else {
                // Limpiar si es válido
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
            }
        });

        // --- ACCIONES FINALES ---

        if (!esValido) {
            // 1. Marcar el Tab PRINCIPAL (Permisos) con icono rojo
            const iconoHtml = '<i class="fa-solid fa-circle-exclamation text-danger ms-2 icon-error-tab"></i>';
            tabButtonMain.insertAdjacentHTML('beforeend', iconoHtml);

            // 2. Llevar al usuario al error
            if (primerInvalido) {
                // Verificar si el error está en una pestaña oculta y abrirla
                const parentPane = primerInvalido.closest('.tab-pane');
                // Si el padre NO es el panel principal, significa que es un sub-tab (Finanzas/Humanos/etc)
                if (parentPane && parentPane.id !== targetIdMain.replace('#', '')) {
                    // Verificar si este panel NO tiene la clase 'active' (está oculto)
                    if (!parentPane.classList.contains('active')) {
                        const subBtn = contentDivMain.querySelector(`button[data-bs-target="#${parentPane.id}"]`);
                        if (subBtn) {
                            // Usar API de Bootstrap para cambiar de pestaña automáticamente
                            const tabInstance = new bootstrap.Tab(subBtn);
                            tabInstance.show();
                        }
                    }
                }

                // Pequeño delay para permitir que la pestaña se abra antes de hacer focus
                setTimeout(() => {
                    primerInvalido.focus();
                    primerInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }
        }

        return esValido;
    }

    // Limpiar error cuando el usuario escriba
    document.getElementById('formSolicitud').addEventListener('input', function (e) {
        if (e.target.classList.contains('is-invalid')) {
            e.target.classList.remove('is-invalid');
        }
    });

    // 4. EVENTOS CLICK (BOTONES INFERIORES)

    btnSiguiente.addEventListener('click', function () {
        const tabActivo = document.querySelector('#ulSolicitud > li > button.active');

        // 1. VALIDAR PASO ACTUAL ANTES DE AVANZAR
        if (!validarPasoActual(tabActivo)) {
            // Si no es válido, detenemos la ejecución aquí.
            return;
        }

        // 2. Si es válido, procedemos a avanzar
        const indexActual = listaTabs.indexOf(tabActivo);
        const siguienteIndex = indexActual + 1;

        if (siguienteIndex < listaTabs.length) {
            const tabBootstrap = new bootstrap.Tab(listaTabs[siguienteIndex]);
            tabBootstrap.show();
        }
    });

    btnAnterior.addEventListener('click', function () {
        const tabActivo = document.querySelector('#ulSolicitud > li > button.active');
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

    const txtBuscar = document.getElementById('txtBuscarDep');
    const lista = document.getElementById('listaResultadosDep');
    const hdnEnum = document.getElementById('hdnDependenciaEnum');

    const containerBuscar = document.getElementById('container-buscar');
    const containerSeleccionado = document.getElementById('container-seleccionado');
    const lblTexto = document.getElementById('lblTextoSeleccionado');
    const btnEliminar = document.getElementById('btnEliminarSeleccion');

    // VARIABLE PARA EL TEMPORIZADOR
    let debounceTimer;

    let indiceNavegacion = -1;

    if (txtBuscar && lista) {
        txtBuscar.addEventListener('keydown', function (e) {
            const items = lista.querySelectorAll('.list-group-item');

            // Si la lista está oculta o vacía, no hacemos nada
            if (lista.style.display === 'none' || items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault(); // Evita que el cursor se mueva en el input
                indiceNavegacion++;

                // Si pasamos el último, volvemos al primero (carrusel)
                if (indiceNavegacion >= items.length) indiceNavegacion = 0;

                actualizarSeleccionVisual(items);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                indiceNavegacion--;

                // Si subimos más allá del primero, vamos al último
                if (indiceNavegacion < 0) indiceNavegacion = items.length - 1;

                actualizarSeleccionVisual(items);
            }
            else if (e.key === 'Enter') {
                // Si hay algo seleccionado con las flechas, simulamos el click
                if (indiceNavegacion > -1) {
                    e.preventDefault(); // Evita el submit del formulario
                    items[indiceNavegacion].click();
                }
            }
            else if (e.key === 'Escape') {
                lista.style.display = 'none';
                indiceNavegacion = -1;
            }
        });

        // --- 2. FUNCIÓN PARA PINTAR EL ELEMENTO SELECCIONADO ---
        function actualizarSeleccionVisual(items) {
            // Limpiar clase 'active' de todos
            items.forEach(item => item.classList.remove('active'));

            // Agregar clase 'active' al actual
            if (indiceNavegacion > -1 && items[indiceNavegacion]) {
                const itemActivo = items[indiceNavegacion];
                itemActivo.classList.add('active');

                // SCROLL AUTOMÁTICO:
                // Esto asegura que si bajas mucho, la lista haga scroll para mostrarte el item
                itemActivo.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }

        // EVENTO: Escribir
        txtBuscar.addEventListener('input', function () {
            const termino = this.value.toLowerCase().trim();

            // A. Si limpia el input, ocultamos la lista INMEDIATAMENTE (sin esperar)
            if (termino === '') {
                clearTimeout(debounceTimer); // Cancelamos cualquier búsqueda pendiente
                lista.style.display = 'none';
                return;
            }

            // B. Cancelamos el temporizador anterior si el usuario sigue escribiendo rápido
            clearTimeout(debounceTimer);

            if (termino.length < 3) return;

            // C. Creamos un nuevo temporizador para esperar 300ms antes de buscar
            debounceTimer = setTimeout(() => {

                // --- INICIO DE LA BÚSQUEDA (Dentro del Timeout) ---

                // Filtramos
                const resultados = lsCatalogoDependencias.filter(item => {
                    const codigo = (item.sCodigo || item.SCodigo || "").toLowerCase();
                    const nombre = (item.sDependencia || item.SDependencia || "").toLowerCase();
                    return codigo.includes(termino) || nombre.includes(termino);
                });

                // Renderizamos
                lista.innerHTML = '';

                if (resultados.length > 0) {
                    resultados.forEach(item => {
                        const sCodigo = item.sCodigo || item.SCodigo;
                        const sDependencia = item.sDependencia || item.SDependencia;

                        const htmlVisual = `<span class="codigo fw-semibold">${sCodigo}</span> <span class="dep mx-1">-</span> <span>${sDependencia}</span>`;

                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'list-group-item list-group-item-action text-start px-3 py-2';
                        btn.innerHTML = htmlVisual;

                        btn.addEventListener('click', () => {
                            fnSeleccionar(sCodigo, htmlVisual);
                        });

                        lista.appendChild(btn);
                    });
                    lista.style.display = 'block';
                } else {
                    lista.innerHTML = '<div class="list-group-item text-muted small fst-italic p-2">No hay coincidencias</div>';
                    lista.style.display = 'block';
                }

                // --- FIN DE LA BÚSQUEDA ---

            }, 300); // <--- TIEMPO DE DELAY (300 milisegundos)

            indiceNavegacion = -1;
        });
    }

    // FUNCIÓN SELECCIONAR
    function fnSeleccionar(codigo, htmlVisual) {
        // Guardamos el código ("11101") en el input hidden
        hdnEnum.value = codigo;

        // Ponemos el HTML bonito en la caja de selección
        lblTexto.innerHTML = htmlVisual;

        // Limpiamos y hacemos el Switch de vistas
        lista.style.display = 'none';
        txtBuscar.value = '';

        containerBuscar.classList.add('d-none');
        containerSeleccionado.classList.remove('d-none');
        containerSeleccionado.classList.add('d-flex');
    }

    // FUNCIÓN ELIMINAR
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function () {
            hdnEnum.value = ''; // Borramos valor
            lblTexto.innerHTML = '';

            // Switch inverso
            containerSeleccionado.classList.remove('d-flex');
            containerSeleccionado.classList.add('d-none');

            containerBuscar.classList.remove('d-none');

            txtBuscar.focus();
        });
    }

    // CERRAR SI CLIC AFUERA
    document.addEventListener('click', function (e) {
        if (containerBuscar && !containerBuscar.contains(e.target)) {
            lista.style.display = 'none';
        }
    });


    //const txtBuscarEntidad = document.getElementById('txtBuscarEntidad');
    //const listaResultados = document.getElementById('lista-resultados-entidad');

    //// Contenedores visuales
    //const containerBuscar = document.getElementById('container-buscar-entidad');
    //const containerSeleccionado = document.getElementById('container-entidad-seleccionada');

    //// Elementos de la selección
    //const lblEntidadTexto = document.getElementById('lblEntidadTexto');
    //const btnQuitarEntidad = document.getElementById('btnQuitarEntidad');

    //// Inputs ocultos (binding con ASP.NET Core)
    //const hdnEntClv = document.getElementById('hdnEntClv');
    //const hdnEntNom = document.getElementById('hdnEntNom');

    //let debounceEntidad; // Para controlar el tiempo de espera al escribir

    //let indiceNavegacion = -1;

    //// --- 1. EVENTO DE BÚSQUEDA (Mientras el usuario escribe) ---
    //if (txtBuscarEntidad && listaResultados) {
    //    txtBuscarEntidad.addEventListener('keydown', function (e) {
    //        const items = listaResultados.querySelectorAll('a.list-group-item');

    //        // Si la lista está oculta o vacía, no hacemos nada
    //        if (listaResultados.style.display === 'none' || items.length === 0) return;

    //        if (e.key === 'ArrowDown') {
    //            e.preventDefault(); // Evita que el cursor se mueva en el input
    //            indiceNavegacion++;

    //            // Si pasamos el último, volvemos al primero (carrusel)
    //            if (indiceNavegacion >= items.length) indiceNavegacion = 0;

    //            actualizarSeleccionVisual(items);
    //        }
    //        else if (e.key === 'ArrowUp') {
    //            e.preventDefault();
    //            indiceNavegacion--;

    //            // Si subimos más allá del primero, vamos al último
    //            if (indiceNavegacion < 0) indiceNavegacion = items.length - 1;

    //            actualizarSeleccionVisual(items);
    //        }
    //        else if (e.key === 'Enter') {
    //            // Si hay algo seleccionado con las flechas, simulamos el click
    //            if (indiceNavegacion > -1) {
    //                e.preventDefault(); // Evita el submit del formulario
    //                items[indiceNavegacion].click();
    //            }
    //        }
    //        else if (e.key === 'Escape') {
    //            listaResultados.style.display = 'none';
    //            indiceNavegacion = -1;
    //        }
    //    });

    //    // --- 2. FUNCIÓN PARA PINTAR EL ELEMENTO SELECCIONADO ---
    //    function actualizarSeleccionVisual(items) {
    //        // Limpiar clase 'active' de todos
    //        items.forEach(item => item.classList.remove('active'));

    //        // Agregar clase 'active' al actual
    //        if (indiceNavegacion > -1 && items[indiceNavegacion]) {
    //            const itemActivo = items[indiceNavegacion];
    //            itemActivo.classList.add('active');

    //            // SCROLL AUTOMÁTICO:
    //            // Esto asegura que si bajas mucho, la lista haga scroll para mostrarte el item
    //            itemActivo.scrollIntoView({
    //                block: 'nearest',
    //                behavior: 'smooth'
    //            });
    //        }
    //    }

    //    txtBuscarEntidad.addEventListener('input', function () {
    //        const query = this.value.trim();
    //        const url = this.getAttribute('data-url'); // Lee la URL del atributo HTML

    //        // Limpiamos temporizador anterior y ocultamos lista para reiniciar
    //        clearTimeout(debounceEntidad);
    //        listaResultados.style.display = 'none';

    //        // Si hay menos de 3 caracteres, no hacemos nada
    //        if (query.length < 3) return;

    //        // Esperar 300ms antes de llamar al servidor (Debounce)
    //        debounceEntidad = setTimeout(() => {
    //            fetch(`${url}?sTermino=${encodeURIComponent(query)}`)
    //                .then(res => res.json())
    //                .then(data => {
    //                    listaResultados.innerHTML = '';

    //                    if (data.length > 0) {
    //                        data.forEach(item => {
    //                            // NOTA: ASP.NET convierte las propiedades a minúscula inicial (camelCase)
    //                            // SCodigo -> sCodigo | SDependencia -> sDependencia
    //                            const codigo = item.sCodigo || item.SCodigo;
    //                            const nombre = item.sDependencia || item.SDependencia;

    //                            // Crear elemento visual de la lista
    //                            const a = document.createElement('a');
    //                            a.className = 'list-group-item list-group-item-action cursor-pointer';
    //                            a.innerHTML = `<span class="fw-bold">${codigo}</span> - <small>${nombre}</small>`;
    //                            a.href = "#";

    //                            // Evento al seleccionar una opción
    //                            a.addEventListener('click', (e) => {
    //                                e.preventDefault();
    //                                fnSeleccionarEntidad(codigo, nombre);
    //                            });

    //                            listaResultados.appendChild(a);
    //                        });
    //                        listaResultados.style.display = 'block';
    //                    } else {
    //                        listaResultados.innerHTML = '<div class="list-group-item text-muted small">No se encontraron resultados</div>';
    //                        listaResultados.style.display = 'block';
    //                    }
    //                })
    //                .catch(err => console.error("Error buscando dependencia:", err));
    //        }, 300);

    //        // IMPORTANTE: Cuando el usuario escribe algo nuevo, reseteamos el índice
    //        indiceNavegacion = -1;
    //    });
    //}

    //// --- 2. FUNCIÓN: SELECCIONAR UNA ENTIDAD ---
    //function fnSeleccionarEntidad(clave, nombre) {
    //    // 1. Llenar inputs ocultos (Lo que se guarda en BD)
    //    if (hdnEntClv) hdnEntClv.value = clave;
    //    if (hdnEntNom) hdnEntNom.value = nombre;

    //    // 2. Actualizar texto visual
    //    if (lblEntidadTexto) lblEntidadTexto.textContent = `${clave} - ${nombre}`;

    //    // 3. Cambiar estado visual: Ocultar buscador, Mostrar seleccionado
    //    if (listaResultados) listaResultados.style.display = 'none';
    //    if (containerBuscar) containerBuscar.classList.add('d-none');

    //    if (containerSeleccionado) {
    //        containerSeleccionado.classList.remove('d-none');
    //        containerSeleccionado.classList.add('d-flex');
    //    }
    //}

    //// --- 3. FUNCIÓN: QUITAR / ELIMINAR SELECCIÓN ---
    //if (btnQuitarEntidad) {
    //    btnQuitarEntidad.addEventListener('click', function () {
    //        // 1. Limpiar inputs ocultos
    //        if (hdnEntClv) hdnEntClv.value = '';
    //        if (hdnEntNom) hdnEntNom.value = '';

    //        // 2. Limpiar input visual
    //        if (txtBuscarEntidad) txtBuscarEntidad.value = '';

    //        // 3. Cambiar estado visual: Ocultar seleccionado, Mostrar buscador
    //        if (containerSeleccionado) {
    //            containerSeleccionado.classList.add('d-none');
    //            containerSeleccionado.classList.remove('d-flex');
    //        }

    //        if (containerBuscar) containerBuscar.classList.remove('d-none');

    //        // 4. Poner foco para escribir de nuevo
    //        setTimeout(() => txtBuscarEntidad.focus(), 100);
    //    });
    //}

    //// --- 4. CERRAR LISTA AL DAR CLIC FUERA ---
    //document.addEventListener('click', function (e) {
    //    // Si el clic NO fue dentro del contenedor del buscador, cerramos la lista
    //    if (containerBuscar && !containerBuscar.contains(e.target)) {
    //        listaResultados.style.display = 'none';
    //    }
    //});

    // ==========================================
    // BUSCADOR DE DEPENDENCIA / ENTIDAD
    // ==========================================

    const txtBuscarHuma = document.getElementById('txtBuscarDepHuma');
    const listaHuma = document.getElementById('listaResultadosDepHuma');
    const hdnEnumHuma = document.getElementById('txtHumanosDependencia');

    const containerBuscarHuma = document.getElementById('container-buscar-huma');
    const containerSeleccionadoHuma = document.getElementById('container-seleccionado-huma');
    const lblTextoHuma = document.getElementById('lblTextoSeleccionadoHuma');
    const btnEliminarHuma = document.getElementById('btnEliminarSeleccionHuma');

    // VARIABLE PARA EL TEMPORIZADOR
    let debounceTimerHuma;

    let indiceNavegacionHuma = -1;

    if (txtBuscarHuma && listaHuma) {
        txtBuscarHuma.addEventListener('keydown', function (e) {
            const itemsHuma = listaHuma.querySelectorAll('.list-group-item');

            // Si la lista está oculta o vacía, no hacemos nada
            if (listaHuma.style.display === 'none' || itemsHuma.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault(); // Evita que el cursor se mueva en el input
                indiceNavegacionHuma++;

                // Si pasamos el último, volvemos al primero (carrusel)
                if (indiceNavegacionHuma >= itemsHuma.length) indiceNavegacionHuma = 0;

                actualizarSeleccionVisualHuma(itemsHuma);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                indiceNavegacionHuma--;

                // Si subimos más allá del primero, vamos al último
                if (indiceNavegacionHuma < 0) indiceNavegacionHuma = itemsHuma.length - 1;

                actualizarSeleccionVisualHuma(itemsHuma);
            }
            else if (e.key === 'Enter') {
                // Si hay algo seleccionado con las flechas, simulamos el click
                if (indiceNavegacionHuma > -1) {
                    e.preventDefault(); // Evita el submit del formulario
                    itemsHuma[indiceNavegacionHuma].click();
                }
            }
            else if (e.key === 'Escape') {
                listaHuma.style.display = 'none';
                indiceNavegacionHuma = -1;
            }
        });

        // --- 2. FUNCIÓN PARA PINTAR EL ELEMENTO SELECCIONADO ---
        function actualizarSeleccionVisualHuma(itemsHuma) {
            // Limpiar clase 'active' de todos
            itemsHuma.forEach(item => item.classList.remove('active'));

            // Agregar clase 'active' al actual
            if (indiceNavegacionHuma > -1 && itemsHuma[indiceNavegacionHuma]) {
                const itemActivoHuma = itemsHuma[indiceNavegacionHuma];
                itemActivoHuma.classList.add('active');

                // SCROLL AUTOMÁTICO:
                // Esto asegura que si bajas mucho, la lista haga scroll para mostrarte el item
                itemActivoHuma.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }

        // EVENTO: Escribir
        txtBuscarHuma.addEventListener('input', function () {
            const terminoHuma = this.value.toLowerCase().trim();

            // A. Si limpia el input, ocultamos la lista INMEDIATAMENTE (sin esperar)
            if (terminoHuma === '') {
                clearTimeout(debounceTimerHuma); // Cancelamos cualquier búsqueda pendiente
                listaHuma.style.display = 'none';
                return;
            }

            // B. Cancelamos el temporizador anterior si el usuario sigue escribiendo rápido
            clearTimeout(debounceTimerHuma);

            if (terminoHuma.length < 3) return;

            // C. Creamos un nuevo temporizador para esperar 300ms antes de buscar
            debounceTimerHuma = setTimeout(() => {

                // --- INICIO DE LA BÚSQUEDA (Dentro del Timeout) ---

                // Filtramos
                const resultados = lsCatalogoDependencias.filter(item => {
                    const codigo = (item.sCodigo || item.SCodigo || "").toLowerCase();
                    const nombre = (item.sDependencia || item.SDependencia || "").toLowerCase();
                    return codigo.includes(terminoHuma) || nombre.includes(terminoHuma);
                });

                // Renderizamos
                listaHuma.innerHTML = '';

                if (resultados.length > 0) {
                    resultados.forEach(item => {
                        const sCodigo = item.sCodigo || item.SCodigo;
                        const sDependencia = item.sDependencia || item.SDependencia;

                        const htmlVisual = `<span class="codigo fw-semibold">${sCodigo}</span> <span class="dep mx-1">-</span> <span>${sDependencia}</span>`;

                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'list-group-item list-group-item-action text-start px-3 py-2';
                        btn.innerHTML = htmlVisual;

                        btn.addEventListener('click', () => {
                            fnSeleccionarHuma(sCodigo, htmlVisual);
                        });

                        listaHuma.appendChild(btn);
                    });
                    listaHuma.style.display = 'block';
                } else {
                    listaHuma.innerHTML = '<div class="list-group-item text-muted small fst-italic p-2">No hay coincidencias</div>';
                    listaHuma.style.display = 'block';
                }

                // --- FIN DE LA BÚSQUEDA ---

            }, 300); // <--- TIEMPO DE DELAY (300 milisegundos)

            indiceNavegacionHuma = -1;
        });
    }

    // FUNCIÓN SELECCIONAR
    function fnSeleccionarHuma(codigo, htmlVisual) {
        // Guardamos el código ("11101") en el input hidden
        hdnEnumHuma.value = codigo;

        // Ponemos el HTML bonito en la caja de selección
        lblTextoHuma.innerHTML = htmlVisual;

        // Limpiamos y hacemos el Switch de vistas
        listaHuma.style.display = 'none';
        txtBuscarHuma.value = '';

        containerBuscarHuma.classList.add('d-none');
        containerSeleccionadoHuma.classList.remove('d-none');
        containerSeleccionadoHuma.classList.add('d-flex');
    }

    // FUNCIÓN ELIMINAR
    if (btnEliminarHuma) {
        btnEliminarHuma.addEventListener('click', function () {
            hdnEnumHuma.value = ''; // Borramos valor
            lblTextoHuma.innerHTML = '';

            // Switch inverso
            containerSeleccionadoHuma.classList.remove('d-flex');
            containerSeleccionadoHuma.classList.add('d-none');

            containerBuscarHuma.classList.remove('d-none');

            txtBuscarHuma.focus();
        });
    }

    // CERRAR SI CLIC AFUERA
    document.addEventListener('click', function (e) {
        if (containerBuscarHuma && !containerBuscarHuma.contains(e.target)) {
            listaHuma.style.display = 'none';
        }
    });
    
    // ============================================
    // BUSCADOR DE DEPENDENCIA / ENTIDAD DE HUMANOS
    // ============================================

    //const txtBuscarEntidadHumanos = document.getElementById('txtBuscarEntidadHumanos');
    //const listaResultadosHumanos = document.getElementById('lista-resultados-entidad-humanos');

    //// Contenedores visuales
    //const containerBuscarHumanos = document.getElementById('container-buscar-entidad-humanos');
    //const containerSeleccionadoHumanos = document.getElementById('container-entidad-seleccionada-humanos');

    //// Elementos de la selección
    //const lblEntidadTextoHumanos = document.getElementById('lblEntidadTextoHumanos');
    //const btnQuitarEntidadHumanos = document.getElementById('btnQuitarEntidadHumanos');

    //// Inputs ocultos (binding con ASP.NET Core)
    //const hdnEntClvHumanos = document.getElementById('hdnEntClvHumanos');
    //const hdnEntNomHumanos = document.getElementById('hdnEntNomHumanos');

    //let debounceEntidadHumanos; // Para controlar el tiempo de espera al escribir

    //let indiceNavegacionHumanos = -1;

    //// --- 1. EVENTO DE BÚSQUEDA (Mientras el usuario escribe) ---
    //if (txtBuscarEntidadHumanos && listaResultadosHumanos) {
    //    txtBuscarEntidadHumanos.addEventListener('keydown', function (e) {
    //        const items = listaResultadosHumanos.querySelectorAll('a.list-group-item');

    //        // Si la lista está oculta o vacía, no hacemos nada
    //        if (listaResultadosHumanos.style.display === 'none' || items.length === 0) return;

    //        if (e.key === 'ArrowDown') {
    //            e.preventDefault(); // Evita que el cursor se mueva en el input
    //            indiceNavegacionHumanos++;

    //            // Si pasamos el último, volvemos al primero (carrusel)
    //            if (indiceNavegacionHumanos >= items.length) indiceNavegacionHumanos = 0;

    //            actualizarSeleccionVisual(items);
    //        }
    //        else if (e.key === 'ArrowUp') {
    //            e.preventDefault();
    //            indiceNavegacionHumanos--;

    //            // Si subimos más allá del primero, vamos al último
    //            if (indiceNavegacionHumanos < 0) indiceNavegacionHumanos = items.length - 1;

    //            actualizarSeleccionVisual(items);
    //        }
    //        else if (e.key === 'Enter') {
    //            // Si hay algo seleccionado con las flechas, simulamos el click
    //            if (indiceNavegacionHumanos > -1) {
    //                e.preventDefault(); // Evita el submit del formulario
    //                items[indiceNavegacionHumanos].click();
    //            }
    //        }
    //        else if (e.key === 'Escape') {
    //            listaResultadosHumanos.style.display = 'none';
    //            indiceNavegacionHumanos = -1;
    //        }
    //    });

    //    // --- 2. FUNCIÓN PARA PINTAR EL ELEMENTO SELECCIONADO ---
    //    function actualizarSeleccionVisual(items) {
    //        // Limpiar clase 'active' de todos
    //        items.forEach(item => item.classList.remove('active'));

    //        // Agregar clase 'active' al actual
    //        if (indiceNavegacionHumanos > -1 && items[indiceNavegacionHumanos]) {
    //            const itemActivo = items[indiceNavegacionHumanos];
    //            itemActivo.classList.add('active');

    //            // SCROLL AUTOMÁTICO:
    //            // Esto asegura que si bajas mucho, la lista haga scroll para mostrarte el item
    //            itemActivo.scrollIntoView({
    //                block: 'nearest',
    //                behavior: 'smooth'
    //            });
    //        }
    //    }

    //    txtBuscarEntidadHumanos.addEventListener('input', function () {
    //        const query = this.value.trim();
    //        const url = this.getAttribute('data-url'); // Lee la URL del atributo HTML

    //        // Limpiamos temporizador anterior y ocultamos lista para reiniciar
    //        clearTimeout(debounceEntidadHumanos);
    //        listaResultadosHumanos.style.display = 'none';

    //        // Si hay menos de 3 caracteres, no hacemos nada
    //        if (query.length < 3) return;

    //        // Esperar 300ms antes de llamar al servidor (Debounce)
    //        debounceEntidadHumanos = setTimeout(() => {
    //            fetch(`${url}?sTermino=${encodeURIComponent(query)}`)
    //                .then(res => res.json())
    //                .then(data => {
    //                    listaResultadosHumanos.innerHTML = '';

    //                    if (data.length > 0) {
    //                        data.forEach(item => {
    //                            // NOTA: ASP.NET convierte las propiedades a minúscula inicial (camelCase)
    //                            // SCodigo -> sCodigo | SDependencia -> sDependencia
    //                            const codigo = item.sCodigo || item.SCodigo;
    //                            const nombre = item.sDependencia || item.SDependencia;

    //                            // Crear elemento visual de la lista
    //                            const a = document.createElement('a');
    //                            a.className = 'list-group-item list-group-item-action cursor-pointer';
    //                            a.innerHTML = `<span class="fw-bold">${codigo}</span> - <small>${nombre}</small>`;
    //                            a.href = "#";

    //                            // Evento al seleccionar una opción
    //                            a.addEventListener('click', (e) => {
    //                                e.preventDefault();
    //                                fnSeleccionarEntidadHumanos(codigo, nombre);
    //                            });

    //                            listaResultadosHumanos.appendChild(a);
    //                        });
    //                        listaResultadosHumanos.style.display = 'block';
    //                    } else {
    //                        listaResultadosHumanos.innerHTML = '<div class="list-group-item text-muted small">No se encontraron resultados</div>';
    //                        listaResultadosHumanos.style.display = 'block';
    //                    }
    //                })
    //                .catch(err => console.error("Error buscando dependencia:", err));
    //        }, 300);

    //        // IMPORTANTE: Cuando el usuario escribe algo nuevo, reseteamos el índice
    //        indiceNavegacionHumanos = -1;
    //    });
    //}

    //// --- 2. FUNCIÓN: SELECCIONAR UNA ENTIDAD ---
    //function fnSeleccionarEntidadHumanos(clave, nombre) {
    //    // 1. Llenar inputs ocultos (Lo que se guarda en BD)
    //    if (hdnEntClvHumanos) hdnEntClvHumanos.value = clave;
    //    if (hdnEntNomHumanos) hdnEntNomHumanos.value = nombre;

    //    // 2. Actualizar texto visual
    //    if (lblEntidadTextoHumanos) lblEntidadTextoHumanos.textContent = `${clave} - ${nombre}`;

    //    // 3. Cambiar estado visual: Ocultar buscador, Mostrar seleccionado
    //    if (listaResultadosHumanos) listaResultadosHumanos.style.display = 'none';
    //    if (containerBuscarHumanos) containerBuscarHumanos.classList.add('d-none');

    //    if (containerSeleccionadoHumanos) {
    //        containerSeleccionadoHumanos.classList.remove('d-none');
    //        containerSeleccionadoHumanos.classList.add('d-flex');
    //    }
    //}

    //// --- 3. FUNCIÓN: QUITAR / ELIMINAR SELECCIÓN ---
    //if (btnQuitarEntidadHumanos) {
    //    btnQuitarEntidadHumanos.addEventListener('click', function () {
    //        // 1. Limpiar inputs ocultos
    //        if (hdnEntClvHumanos) hdnEntClvHumanos.value = '';
    //        if (hdnEntNomHumanos) hdnEntNomHumanos.value = '';

    //        // 2. Limpiar input visual
    //        if (txtBuscarEntidadHumanos) txtBuscarEntidadHumanos.value = '';

    //        // 3. Cambiar estado visual: Ocultar seleccionado, Mostrar buscador
    //        if (containerSeleccionadoHumanos) {
    //            containerSeleccionadoHumanos.classList.add('d-none');
    //            containerSeleccionadoHumanos.classList.remove('d-flex');
    //        }

    //        if (containerBuscarHumanos) containerBuscarHumanos.classList.remove('d-none');

    //        // 4. Poner foco para escribir de nuevo
    //        setTimeout(() => txtBuscarEntidadHumanos.focus(), 100);
    //    });
    //}

    //// --- 4. CERRAR LISTA AL DAR CLIC FUERA ---
    //document.addEventListener('click', function (e) {
    //    // Si el clic NO fue dentro del contenedor del buscador, cerramos la lista
    //    if (containerBuscarHumanos && !containerBuscarHumanos.contains(e.target)) {
    //        listaResultadosHumanos.style.display = 'none';
    //    }
    //});
});