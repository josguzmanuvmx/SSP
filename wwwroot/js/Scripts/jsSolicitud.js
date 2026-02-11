document.addEventListener("DOMContentLoaded", function () {

    // ================
    // ACTIVAR TOOLTIP
    // ================
    var lsTooltip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    lsTooltip.map(function (tooltip) {
        return new bootstrap.Tooltip(tooltip, {
            animation: true,
            delay: { "show": 100, "hide": 100 }
        })
    });

    // ==================
    // ALTERNAR DETALLES
    // ==================
    const lsDivAlternarDetalle = document.querySelectorAll('.clsAlternarDetalle');
    lsDivAlternarDetalle.forEach(txtDetalle => {
        const fnAlternar_DetallePermiso = (bMarcado) => {
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
            fnAlternar_DetallePermiso(this.checked);
        });
        if (txtDetalle.checked) {
            fnAlternar_DetallePermiso(true);
        }
    });

    // =========================
    // TABLA GLOSARIO DE ACTIVIDADES
    // =========================
    const lsCatalogoDependencias = window.datosDependencias || [];
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

    // ===============
    // LIMPIAR TEXTO
    // ===============
    function fnObtener_TextoFormateado(sTexto) {
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
            var ddlPermisos = $('#ddlPermisos').val();
            if (!ddlPermisos) return true;
            var sFiltroPermisos = fnObtener_TextoFormateado(ddlPermisos);
            var lsContenido = fnObtener_TextoFormateado(data[0]);
            return lsContenido.includes(sFiltroPermisos);
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

    // =============================
    // FORMULARIO GUARDAR SOLICITUD
    // =============================
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', async function () {
        const btn = this;
        const textoOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
        const formSolicitud = document.getElementById('formSolicitud');
        const formDataSolicitud = new formDataSolicitud(formSolicitud);
        const urlAction = form.getAttribute('data-url-guardar') || form.action;
        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formDataSolicitud
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

    // =======================
    // INPUTS USUARIO GENERAL
    // =======================
    const lsTxtUsuario = {
        sNomEmpl: document.getElementById('SNomEmpl'),
        nNoPer: document.getElementById('NNoPer'),
        sUsuario: document.getElementById('SUsuario'),
        sCorreo: document.getElementById('SCorreo'),
        Region: document.getElementById('Region'),
        sPueEmpl: document.getElementById('SPueEmpl'),
    };

    // ===================================
    // BUSCAR Y RELLENAR DATOS DE USUARIO
    // ===================================
    function fnActualizar_SeleccionUsuario(lsItems, idUsuario) {
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
        if (lsTxtUsuario.Region) lsTxtUsuario.Region.value = emp.nRegClv || '';
    }

    // ===============
    // BUSCAR USUARIO
    // ===============
    function fnBuscarUsuario(sUsuario, sResultados, divHumaContainer = null) {
        let debounceTimer;
        let idUsuario = -1;

        // R. HUMANOS
        let txtHumanosNoPer;
        let txtHumanosNomEmpl;
        let txtHumanosUsuario;
        let btnHumaManual;
        // ---------------------

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
                    fnAlternar_CampoUsuario(txtUsr, false);
                });
                txtHumanosNomEmpl.focus();
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
                    fnActualizar_SeleccionUsuario(lsItems, idUsuario);
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    idUsuario--;
                    if (idUsuario < 0) idUsuario = lsItems.length - 1;
                    fnActualizar_SeleccionUsuario(lsItems, idUsuario);
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


    // ========================================================
    // BOTON MANUAL PARA ALTERNAR EN INGRESAR DATOS EN USUARIO
    // ========================================================
    function fnAlternar_CampoUsuario(txtUsr, bBloquear) {
        if (bBloquear) {
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
    }
    function fnBloquear_CamposUsuario(bBloquear) {
        Object.values(lsTxtUsuario).forEach(txtUsr => {
            fnAlternar_CampoUsuario(txtUsr, bBloquear);
        });
    }
    const btnManual = document.getElementById('btnManual');
    btnManual.addEventListener('click', function (e) {
        e.preventDefault();
        fnBloquear_CamposUsuario(false);
        lsTxtUsuario.sNomEmpl.focus();
    });
    

    // =============================
    // SOLICITUDES DOCUMENTO ACTIVO
    // =============================
    const divSinDocumentos = document.getElementById('divSinDocumentos');
    const divDescargarSolicitudes = document.getElementById('divDescargarSolicitudes');
    function fnActualizar_ExisteSolicitud() {
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

    // ====================
    // CONFIGURAR PERMISOS
    // ====================
    function fnConfigurar_Permisos(sPermiso, sActivo) {
        const txtActivo = document.getElementById(sActivo);
        const btnHabilitar = document.getElementById('btnHabilitar' + sPermiso);
        const btnDeshabilitar = document.getElementById('btnDeshabilitar' + sPermiso);
        const divOverlay = document.getElementById('divOverlay' + sPermiso);
        const divContenido = document.getElementById('divContenido' + sPermiso);
        const lsTxt = divContenido.querySelectorAll('input, select, textarea');
        const divDocumento = document.getElementById('divDoc' + sPermiso);

        function fnAlternar_Permisos(bModo) {
            txtActivo.checked = bModo;
            if (bModo) {
                divOverlay.classList.add('d-none');
                divOverlay.classList.remove('d-flex');
                divContenido.style.opacity = '1';
                divContenido.style.pointerEvents = 'auto';
                btnDeshabilitar.classList.remove('d-none');
                lsTxt.forEach(input => input.removeAttribute('disabled'));
                if (divDocumento) divDocumento.classList.remove('d-none');
            } else {
                divOverlay.classList.remove('d-none');
                divOverlay.classList.add('d-flex');
                divContenido.style.opacity = '0.3';
                divContenido.style.pointerEvents = 'none';
                btnDeshabilitar.classList.add('d-none');
                lsTxt.forEach(input => input.setAttribute('disabled', 'disabled'));
                if (divDocumento) divDocumento.classList.add('d-none');
            }
            fnActualizar_ExisteSolicitud();
        }
        btnHabilitar.addEventListener('click', () => fnAlternar_Permisos(true));
        btnDeshabilitar.addEventListener('click', () => fnAlternar_Permisos(false));
        fnAlternar_Permisos(txtActivo.checked);
    }
    fnConfigurar_Permisos('Estudiantes', 'txtEstuAct');
    fnConfigurar_Permisos('Finanzas', 'txtFinaAct');
    fnConfigurar_Permisos('Humanos', 'txtHumaAct');
    
    // --------


    // =========================
    // PREVISUALIZAR FORMULARIO
    // =========================
    const formSolicitud = document.getElementById('formSolicitud');

    async function fnActualizar_PrevisualizarSolicitud(sDocumento, idIframe, idBtnDescarga = null, idLoader, idVerDocumento = null) {
        const iframe = document.getElementById(idIframe);
        if (!iframe) return;
        const btnDescarga = idBtnDescarga ? document.getElementById(idBtnDescarga) : null;
        const divVerDocumento = idVerDocumento ? document.getElementById(idVerDocumento) : null;
        const loader = document.getElementById(idLoader);
        const urlAction = formSolicitud.getAttribute('data-url-preview');
        iframe.style.opacity = '0.5';
        if (btnDescarga) btnDescarga.classList.add('disabled');
        if (divVerDocumento) divVerDocumento.classList.add('d-none');
        if (loader) {
            loader.innerHTML = `
            <div class="spinner-border text-secondary mb-2" role="status"></div>
            <small class="text-muted fw-bold">Generando vista previa...</small>
        `;
            loader.classList.remove('d-none');
        }
        // -----------------------

        const formDataSolicitud = new FormData(formSolicitud);
        formDataSolicitud.append('sTipo', sDocumento);
        // if (loader) loader.classList.add('d-none');

        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formDataSolicitud
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
                    btnDescarga.download = `Solicitud_${sDocumento}_${fecha}.pdf`;
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
    const iframeSolicitud = document.getElementById('iframeSolicitud');
    const mdlPrevisualizar = document.getElementById('mdlPrevisualizarDocumento');
    if (mdlPrevisualizar) {
        mdlPrevisualizar.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const tipo = button.getAttribute('data-tipo');
            fnActualizar_PrevisualizarSolicitud(tipo, 'iframeSolicitud', 'btnDescargarModal');
            iframeSolicitud.style.opacity = '0';
        });
        // Opcional: Limpiar al cerrar para que no se quede la URL vieja
        mdlPrevisualizar.addEventListener('hidden.bs.modal', function () {
            const btn = document.getElementById('btnDescargarModal');
            if (btn) btn.href = "#";
            document.activeElement.blur();
        });
    }
    if (iframeSolicitud) {
        iframeSolicitud.addEventListener('load', () => {
            iframeSolicitud.style.opacity = '1';
        });
    }

    const mdlGlosarioActividades = document.getElementById('mdlGlosarioActividades');
    if (mdlGlosarioActividades) {
        //mdlGlosarioActividades.addEventListener('show.bs.modal', function (event) {
        //    const button = event.relatedTarget;
        //    const tipo = button.getAttribute('data-tipo');
        //    fnActualizar_PrevisualizarSolicitud(tipo, 'iframeSolicitud', 'btnDescargarModal');
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
        // if (txtFinaAct.checked) fnActualizar_PrevisualizarSolicitud('SPRFM', 'iframeMiniHumanos');
        if (txtFinaAct && txtFinaAct.checked) {
            fnActualizar_PrevisualizarSolicitud('Finanzas', 'iframeMiniFinanzas', 'btnDescargaFinanzas', 'divCargandoFinanzas', 'divVerFinanzas');
            bDocumentos = true;
        }
        if (txtHumaAct && txtHumaAct.checked) {
            fnActualizar_PrevisualizarSolicitud('Humanos', 'iframeMiniHumanos', 'btnDescargaHumanos', 'divCargandoHumanos', 'divVerHumanos');
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
            const formDataSolicitud = new FormData(formSolicitud);
            const urlZip = formSolicitud.getAttribute('data-url-zip');

            try {
                // 2. Enviar petición POST
                const response = await fetch(urlZip, {
                    method: 'POST',
                    body: formDataSolicitud
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
        const txtBusqieda = container.querySelector('.input-search-user');
        const resultsContainer = container.querySelector('.results-container');
        const btnClear = container.querySelector('.btn-clear-search');

        // Referencias a los campos de destino
        const inpNoPer = container.querySelector('.field-noper');
        const inpNombre = container.querySelector('.field-nombre');
        const inpUsuario = container.querySelector('.field-usuario');
        const inpDep = container.querySelector('.field-dep');

        let debounceTimer;

        let indiceNavegacionExtra = -1;

        if (txtBusqieda && resultsContainer) {
            txtBusqieda.addEventListener('keydown', function (e) {
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

            txtBusqieda.addEventListener('input', function () {
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
                                        txtBusqieda.value = '';
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
            if (!txtBusqieda.contains(e.target) && !resultsContainer.contains(e.target)) {
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
});