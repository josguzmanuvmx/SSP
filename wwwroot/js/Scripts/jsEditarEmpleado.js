document.addEventListener("DOMContentLoaded", function () {

    // --- 1. SELECCIÓN DE ELEMENTOS ---
    const buscador = document.getElementById('buscador-usuarios');
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const campoUsuario = document.getElementById('SUsuario');
    const campoNumPersonal = document.getElementById('NNoPersonal');
    const formAgregar = document.getElementById('formAgregar');

    const txtAdmin = document.getElementById('BAdmin');
    const txtSprfm = document.getElementById('BSprfm');
    const txtSiisu = document.getElementById('BSiisu');
    const txtActivo = document.getElementById('BActivo');

    const hPermisos = document.getElementById('hPermisos');
    const hEstado = document.getElementById('hEstado');

    const btnActualizar = document.getElementById('btnActualizar');

    // Variable para rastrear la selección del teclado
    let selectedIndex = -1;

    // --- 2. FUNCIÓN PARA ACTUALIZAR EL RESALTADO VISUAL ---
    function updateHighlight(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('active'); // 'active' es la clase de Bootstrap
            } else {
                item.classList.remove('active');
            }
        });
    }

    // --- 3. MANEJADOR PARA LA BÚSQUEDA (FETCH) ---
    buscador.addEventListener('input', async function () {
        divError.classList.add('d-none');

        const termino = this.value;
        selectedIndex = -1; // Resetear la selección en cada nueva búsqueda

        if (termino.length < 2) {
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('show');
            return;
        }

        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Usamos 'term=' para que coincida con el parámetro del controlador
        const response = await fetch(`/Empleados/BuscarUsuarios?sUsuario=${termino}`);
        const resultados = await response.json();

        resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

        if (resultados.length > 0) {
            resultadosDiv.classList.add('show');
            resultados.forEach(usuario => {
                const item = document.createElement('a');
                item.classList.add('dropdown-item', 'cursor-pointer');
                item.href = '#';
                item.textContent = usuario.label; // ej. "Ángel Guzmán (angel) - 12345"

                // Guardamos todos los datos que necesitamos en el 'dataset'
                item.dataset.susuario = usuario.sUsuario;
                item.dataset.nnopersonal = usuario.nNoPersonal;

                // Añadir el evento de clic
                item.addEventListener('click', async function (e) {
                    e.preventDefault();

                    const sUsuario = this.dataset.susuario;
                    const nNoPersonal = this.dataset.nnopersonal;

                    const checkResponse = await fetch(`/Empleados/EmpleadoExiste?sUsuario=${sUsuario}`);
                    const data = await checkResponse.json();

                    if (data.existe) {
                        // Si el empleado ya existe, muestra el mensaje de error
                        divError.textContent = `El empleado con el usuario '${sUsuario}' ya está registrado.`;
                        divError.classList.remove('d-none');
                        return;
                    } else {
                        divError.classList.add('d-none');
                    }

                    // Rellenar los campos del formulario
                    if (campoUsuario) campoUsuario.value = sUsuario;
                    if (campoNumPersonal) campoNumPersonal.value = nNoPersonal;

                    // Ocultar el dropdown y limpiar
                    buscador.value = this.textContent;
                    resultadosDiv.innerHTML = '';
                    resultadosDiv.classList.remove('show');
                    selectedIndex = -1;

                    // Activar campos y textos
                    txtAdmin.disabled = false;
                    txtSprfm.disabled = false;
                    txtSiisu.disabled = false;
                    txtActivo.disabled = false;
                    btnAgregar.disabled = false;
                    hPermisos.classList.remove("opacity-50")
                    hEstado.classList.remove("opacity-50")
                    formAgregar.classList.remove("bg-light")
                });

                resultadosDiv.appendChild(item);
            });
        } else {
            // Ocultar si no hay resultados
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('show');
        }
    });

    // --- 4. MANEJADOR PARA LAS TECLAS (FLECHAS Y ENTER) ---
    buscador.addEventListener('keydown', function (e) {
        const items = resultadosDiv.querySelectorAll('.dropdown-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex++;
            if (selectedIndex >= items.length) selectedIndex = 0;
            updateHighlight(items);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex--;
            if (selectedIndex < 0) selectedIndex = items.length - 1;
            updateHighlight(items);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex > -1) {
                // Simula un clic en el ítem resaltado
                items[selectedIndex].click();
            }
        }
    });

    // --- 5. MANEJADOR PARA OCULTAR (CLIC FUERA) ---
    document.addEventListener('click', function (e) {
        if (!buscador.contains(e.target)) {
            resultadosDiv.classList.remove('show');
            selectedIndex = -1;
        }
    });
});