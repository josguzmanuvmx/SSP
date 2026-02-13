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
        const formDataSolicitud = new FormData(formSolicitud);
        const urlAction = formSolicitud.getAttribute('data-url-guardar') || formSolicitud.action;

        console.log(formSolicitud)
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
    function fnBuscar_Usuario(sUsuario, sResultados, divHumaContainer = null) {
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
    fnBuscar_Usuario('txtUsuario', 'divResultados')


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


    // ===================================
    // ACTUALIZAR PREVISUALIZAR SOLICITUD
    // ===================================
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
        const formDataSolicitud = new FormData(formSolicitud);
        formDataSolicitud.append('sTipo', sDocumento);
        try {
            const response = await fetch(urlAction, {
                method: 'POST',
                body: formDataSolicitud
            });
            if (response.ok) {
                const blob = await response.blob();
                const urlBlob = URL.createObjectURL(blob);
                iframe.onload = function () {
                    if (loader) loader.classList.add('d-none');
                    if (divVerDocumento) divVerDocumento.classList.remove('d-none');
                    iframe.style.opacity = '1'; // Restaurar opacidad aquí
                };
                iframe.src = urlBlob + "#toolbar=0";
                if (btnDescarga) {
                    btnDescarga.href = urlBlob;
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
    // ----------------------

    // ==============================
    // MODAL PREVISUALIZAR SOLICITUD
    // ==============================
    const iframeSolicitud = document.getElementById('iframeSolicitud');
    const mdlPrevisualizar = document.getElementById('mdlPrevisualizarDocumento');
    if (mdlPrevisualizar) {
        mdlPrevisualizar.addEventListener('show.bs.modal', function (event) {
            const btnTarget = event.relatedTarget;
            const sTipo = btnTarget.getAttribute('data-tipo');
            fnActualizar_PrevisualizarSolicitud(sTipo, 'iframeSolicitud', 'btnDescargarModal');
            iframeSolicitud.style.opacity = '0';
        });
        // Opcional: Limpiar al cerrar para que no se quede la URL vieja
        mdlPrevisualizar.addEventListener('hidden.bs.modal', function () {
            const btnDescargarModal = document.getElementById('btnDescargarModal');
            if (btnDescargarModal) btnDescargarModal.href = "#";
            document.activeElement.blur();
        });
    }
    if (iframeSolicitud) {
        iframeSolicitud.addEventListener('load', () => {
            iframeSolicitud.style.opacity = '1';
        });
    }
    // ----------------------

    // ==============================
    // MODAL GLOSARIO DE ACTIVIDADES
    // ==============================
    const mdlGlosarioActividades = document.getElementById('mdlGlosarioActividades');
    if (mdlGlosarioActividades) {
        mdlGlosarioActividades.addEventListener('hidden.bs.modal', function () {
            const btnGlosarioActividades = document.getElementById('btnGlosarioActividades');
            if (btnGlosarioActividades) btnGlosarioActividades.href = "#";
            document.activeElement.blur();
        });
    }
    // ----------------------

    // ========================================
    // ACTUALIZAR SOLICITUDES EN TAB DESCARGAR
    // ========================================
    function fnActualizar_Solicitudes() {
        const divDescargarTodo = document.getElementById('divDescargarSolicitudes');
        let bExisteSolicitud = false;
        if (txtFinaAct && txtFinaAct.checked) {
            fnActualizar_PrevisualizarSolicitud('Finanzas', 'iframeMiniFinanzas', 'btnDescargaFinanzas', 'divCargandoFinanzas', 'divVerFinanzas');
            bExisteSolicitud = true;
        }
        if (txtHumaAct && txtHumaAct.checked) {
            fnActualizar_PrevisualizarSolicitud('Humanos', 'iframeMiniHumanos', 'btnDescargaHumanos', 'divCargandoHumanos', 'divVerHumanos');
            bExisteSolicitud = true;
        }
        if (divDescargarTodo) {
            if (bExisteSolicitud) {
                divDescargarTodo.classList.remove('d-none');
            } else {
                divDescargarTodo.classList.add('d-none');
            }
        }
    }
    const tabSolicitud = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabSolicitud.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            const tabActual = event.target.id;
            if (tabActual === 'divDescargar') fnActualizar_Solicitudes();
        });
    });
    // Cargar todos los documentos al iniciar
    document.addEventListener("DOMContentLoaded", () => {
        fnActualizar_Solicitudes();
    });
    // ----------------------

    // ================================
    // DESCARGAR TODAS LAS SOLICITUDES
    // ================================
    const btnDescargarZip = document.getElementById('btnDescargarTodoZip');
    if (btnDescargarZip && formSolicitud) {
        btnDescargarZip.addEventListener('click', async (e) => {
            e.preventDefault();
            const sTextoDescargarZip = btnDescargarZip.innerHTML;
            btnDescargarZip.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generando ZIP...';
            btnDescargarZip.classList.add('disabled');
            const formDataSolicitud = new FormData(formSolicitud);
            const sURLZip = formSolicitud.getAttribute('data-url-zip');
            try {
                const response = await fetch(sURLZip, {
                    method: 'POST',
                    body: formDataSolicitud
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const sURLBlob = URL.createObjectURL(blob);
                    const aDescargaTemporal = document.createElement('a');
                    aDescargaTemporal.href = sURLBlob;
                    aDescargaTemporal.download = `Paquete_Solicitudes_${new Date().getTime()}.zip`;
                    document.body.appendChild(aDescargaTemporal);
                    aDescargaTemporal.click();
                    document.body.removeChild(aDescargaTemporal);
                    URL.revokeObjectURL(sURLBlob);
                } else {
                    console.error("Error al generar el ZIP");
                    alert("Ocurrió un error al generar el archivo comprimido.");
                }
            } catch (error) {
                console.error("Error de red:", error);
                alert("Error de conexión al intentar descargar.");
            } finally {
                btnZip.innerHTML = sTextoDescargarZip;
                btnZip.classList.remove('disabled');
            }
        });
    }
    // ----------------------

    // ================================
    // ORDENAR USUARIOS R. HUMANOS
    // ================================
    const btnAgregar = document.getElementById('btnAgregarPestanaUsuario');
    const ulUsuariosRHumanos = document.getElementById('ulUsuariosRHumanos');
    const divContenidoRHumanos = document.getElementById('divContenidoRHumanos');
    const spUsuariosMaximo = document.getElementById('spUsuariosMaximo');
    const tmplTabUsuario = document.getElementById('tmplTabUsuario');
    const tmplContenidoUsuario = document.getElementById('tmplContenidoUsuario');
    const nUsuariosMaximo = 10;
    function fnOrdenar_Usuarios() {
        const ulTabsUsuario = ulUsuariosRHumanos.querySelectorAll('.item-usuario-extra');
        const divContenidoUsuario = divContenidoRHumanos.querySelectorAll('.content-usuario-extra');
        if (ulTabsUsuario.length + 1 >= nUsuariosMaximo) {
            btnAgregar.parentElement.classList.add('d-none');
            spUsuariosMaximo.classList.remove('d-none');
        } else {
            btnAgregar.parentElement.classList.remove('d-none');
            spUsuariosMaximo.classList.add('d-none');
        }
        divContenidoUsuario.forEach((pane, index) => {
            const nPosUsuario = index + 2;
            const spNumero = pane.querySelector('.sp-numero');
            if (spNumero) spNumero.textContent = nPosUsuario;
            if (ulTabsUsuario[index]) {
                const spNombre = ulTabsUsuario[index].querySelector('.sp-nombre');
                if (spNombre) spNombre.textContent = `#${nPosUsuario}`;
            }
            const lsTxtContenido = pane.querySelectorAll('input, select');
            lsTxtContenido.forEach(txt => {
                if (txt.name) {
                    txt.name = txt.name.replace(
                        /(LsHumaAdi|MoHumanos\.LsHumaAdi)\[.*?\]|LsHumaAdi\[INDEX_LISTA\]/,
                        `MoHumanos.LsHumaAdi[${index}]`
                    );
                }
                if (txt.type === 'radio' && txt.id) {
                    const sId = txt.id.split('_')[0];
                    const sIdNueva = `${sId}_${index}_EXTRA`;
                    txt.id = sIdNueva;
                    const txtSiguiente = txt.nextElementSibling;
                    if (txtSiguiente && txtSiguiente.tagName === 'LABEL') {
                        txtSiguiente.setAttribute('for', sIdNueva);
                    }
                }
            });
        });
    }
    // ----------------------

    // ================================
    // USUARIO ADICIONAL EN R. HUMANOS
    // ================================
    function fnCrear_UsuarioRHumanos() {
        const dtId = new Date().getTime();
        const tmplTabClonada = tmplTabUsuario.content.cloneNode(true);
        tmplTabClonada.querySelector('button').id = `tab-user-${dtId}`;
        tmplTabClonada.querySelector('button').setAttribute('data-bs-target', `#content-user-${dtId}`);
        ulUsuariosRHumanos.insertBefore(tmplTabClonada, ulUsuariosRHumanos.lastElementChild);
        const tmplContenidoClonado = tmplContenidoUsuario.content.cloneNode(true);
        const sIdContenido = `content-user-${dtId}`;
        tmplContenidoClonado.querySelector('.tab-pane').id = sIdContenido;
        divContenidoRHumanos.appendChild(tmplContenidoClonado);
        const divContenido = document.getElementById(sIdContenido);
        fnBuscar_Usuario('.txtUsuario', '.divResultados', divContenido)
        fnOrdenar_Usuarios();
        const tmplRefTabClonada = document.querySelector(`#tab-user-${dtId}`);
        const tbClonada = new bootstrap.Tab(tmplRefTabClonada);
        tbClonada.show();
    }
    btnAgregar.addEventListener('click', function () {
        const lsUsuariosRHumanos = ulUsuariosRHumanos.querySelectorAll('.nav-item').length - 1;
        if (lsUsuariosRHumanos < nUsuariosMaximo) {
            fnCrear_UsuarioRHumanos();
        }
    });
    ulUsuariosRHumanos.addEventListener('click', function (e) {
        const btnEliminarTab = e.target.closest('.btn-cerrar-tab');
        if (btnEliminarTab) {
            e.preventDefault();
            e.stopPropagation();
            const tabButton = btnEliminarTab.closest('button.nav-link');
            if (!tabButton) return;
            const targetId = tabButton.getAttribute('data-bs-target');
            const liPadre = tabButton.closest('li');
            if (liPadre) liPadre.remove();
            const contentDiv = document.querySelector(targetId);
            if (contentDiv) contentDiv.remove();
            if (tabButton.classList.contains('active')) {
                const mainTabEl = document.querySelector('#tab-usuario-main');
                if (mainTabEl) {
                    const mainTab = new bootstrap.Tab(mainTabEl);
                    mainTab.show();
                }
            }
            fnOrdenar_Usuarios();
        }
    });
    // ----------------------

    // ============================================
    // LOGICA DE NAVEGACIÓN (ANTERIOR / SIGUIENTE)
    // ============================================
    const btnAnterior = document.getElementById('btnAnterior')
    const btnSiguiente = document.getElementById('btnSiguiente')
    const lsUlNavegacion = Array.from(document.querySelectorAll('#ulSolicitud > li > button[data-bs-toggle="pill"]'));
    function fnActualizar_BotonNavegacion() {
        const btnNavegacionActivo = document.querySelector('#ulSolicitud > li > button.active');
        if (!btnNavegacionActivo) return;
        const nIndexActual = lsUlNavegacion.indexOf(btnNavegacionActivo);
        const nTotalItemsNavegacion = lsUlNavegacion.length;
        if (nIndexActual === 0) {
            btnAnterior.classList.add('d-none');
        } else {
            btnAnterior.classList.remove('d-none');
        }
        if (nIndexActual === nTotalItemsNavegacion - 1) {
            btnSiguiente.classList.add('d-none');
            btnSiguiente.classList.remove('d-flex');
        } else {
            btnSiguiente.classList.remove('d-none');
        }
    }
    // ----------------------

    // ===================
    // VALIDAR FORMULARIO
    // ===================
    function fnObtener_FormularioValido(btnNavegacionActivo) {
        const divNavegacionTarget = btnNavegacionActivo.getAttribute('data-bs-target');
        const divContenidoFormulario = document.querySelector(divNavegacionTarget);
        const iIconoError = btnNavegacionActivo.querySelector('.icon-error-tab');
        if (iIconoError) iIconoError.remove();
        const lsBtnFormulario = divContenidoFormulario.querySelectorAll('button[data-bs-toggle="pill"]');
        lsBtnFormulario.forEach(btn => {
            const iIconoError = btn.querySelector('.icon-error-tab');
            if (iIconoError) iIconoError.remove();
        });
        const lsTxtFormulario = divContenidoFormulario.querySelectorAll('input, select, textarea');
        let bFormularioValido = true;
        let txtPrimerCampoInvalido = null;
        lsTxtFormulario.forEach(txt => {
            if (txt.closest('#divEstudiantes')) {
                const txtCheckboxEstudiante = document.getElementById('txtEstuAct');
                if (txtCheckboxEstudiante && !txtCheckboxEstudiante.checked) return;
            }
            if (txt.closest('#divFinanzas')) {
                const txtCheckboxFinanzas = document.getElementById('txtFinaAct');
                if (txtCheckboxFinanzas && !txtCheckboxFinanzas.checked) return;
            }
            if (txt.closest('#divHumanos')) {
                const txtCheckboxHumanos = document.getElementById('txtHumaAct');
                if (txtCheckboxHumanos && !txtCheckboxHumanos.checked) return;
            }
            if (txt.type === 'hidden' && !txt.hasAttribute('required')) return;
            if (txt.type === 'button' || txt.type === 'submit') return;
            let bErrorCampo = false;
            if (!txt.checkValidity()) {
                bErrorCampo = true;
            }
            if (txt.hasAttribute('required')) {
                if (txt.type === 'checkbox' || txt.type === 'radio') {
                } else {
                    if (!txt.value || txt.value.trim() === '') {
                        bErrorCampo = true;
                    }
                }
            }
            if (txt.tagName === 'SELECT' && txt.hasAttribute('disabled')) {
                if (!txt.value || txt.value === '') bErrorCampo = true;
            }
            if (bErrorCampo) {
                bFormularioValido = false;
                txt.classList.add('is-invalid');
                txt.classList.remove('is-valid');
                if (!txtPrimerCampoInvalido) txtPrimerCampoInvalido = txt;
                const divContenedorPadre = txt.closest('.tab-pane');
                if (divContenedorPadre && divContenedorPadre.id !== divNavegacionTarget.replace('#', '')) {
                    const btnSubcontenido = divContenidoFormulario.querySelector(`button[data-bs-target="#${divContenedorPadre.id}"]`);
                    if (btnSubcontenido) {
                        if (!btnSubcontenido.querySelector('.icon-error-tab')) {
                            const iconoHtml = '<i class="fa-solid fa-circle-exclamation text-danger ms-2 icon-error-tab"></i>';
                            btnSubcontenido.insertAdjacentHTML('beforeend', iconoHtml);
                        }
                    }
                }
            } else {
                txt.classList.remove('is-invalid');
                txt.classList.remove('is-valid');
            }
        });
        if (!bFormularioValido) {
            const iIconoError = '<i class="fa-solid fa-circle-exclamation text-danger ms-2 icon-error-tab"></i>';
            btnNavegacionActivo.insertAdjacentHTML('beforeend', iIconoError);
            if (txtPrimerCampoInvalido) {
                const divContenedorPadre = txtPrimerCampoInvalido.closest('.tab-pane');
                if (divContenedorPadre && divContenedorPadre.id !== divNavegacionTarget.replace('#', '')) {
                    if (!divContenedorPadre.classList.contains('active')) {
                        const btnSubcontenido = divContenidoFormulario.querySelector(`button[data-bs-target="#${divContenedorPadre.id}"]`);
                        if (btnSubcontenido) {
                            const divTabContenido = new bootstrap.Tab(btnSubcontenido);
                            divTabContenido.show();
                        }
                    }
                }
                setTimeout(() => {
                    txtPrimerCampoInvalido.focus();
                    txtPrimerCampoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }
        }
        return bFormularioValido;
    }
    // ----------------------

    // ============================
    // ERROR EN FORMATO FORMULARIO
    // ============================
    document.getElementById('formSolicitud').addEventListener('input', function (e) {
        if (e.target.classList.contains('is-invalid')) {
            e.target.classList.remove('is-invalid');
        }
    });
    // ----------------------

    // ======================================
    // BOTONES NAVEGACION ANTERIOR/SIGUIENTE
    // ======================================
    btnSiguiente.addEventListener('click', function () {
        const btnNavegacionActivo = document.querySelector('#ulSolicitud > li > button.active');
        if (!fnObtener_FormularioValido(btnNavegacionActivo)) {
            return;
        }
        const nIndexActual = lsUlNavegacion.indexOf(btnNavegacionActivo);
        const siguienteIndex = nIndexActual + 1;
        if (siguienteIndex < lsUlNavegacion.length) {
            const tabBootstrap = new bootstrap.Tab(lsUlNavegacion[siguienteIndex]);
            tabBootstrap.show();
        }
    });
    btnAnterior.addEventListener('click', function () {
        const btnNavegacionActivo = document.querySelector('#ulSolicitud > li > button.active');
        const nIndexActual = lsUlNavegacion.indexOf(btnNavegacionActivo);
        const anteriorIndex = nIndexActual - 1;
        if (anteriorIndex >= 0) {
            const tabBootstrap = new bootstrap.Tab(lsUlNavegacion[anteriorIndex]);
            tabBootstrap.show();
        }
    });

    lsUlNavegacion.forEach(tabBtn => {
        tabBtn.addEventListener('shown.bs.tab', function () {
            // Actualizamos visibilidad de botones
            fnActualizar_BotonNavegacion();

            // Llamada a funciones externas si existen
            if (typeof fnActualizar_Solicitudes === 'function') {
                fnActualizar_Solicitudes();
            }
        });
    });

    // 6. INICIALIZAR AL CARGAR
    // Ejecutamos una vez para asegurar que el botón "Anterior" esté oculto al principio
    fnActualizar_BotonNavegacion();

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