document.addEventListener("DOMContentLoaded", function () {

    const buscador = document.getElementById('buscador-usuarios');
    const resultadosDiv = document.getElementById('resultados-busqueda');

    // --- 1. OBTENEMOS TODOS LOS CAMPOS A RELLENAR ---
    const campoUsuario = document.getElementById('SUsuario');
    const campoNumPersonal = document.getElementById('NNoPersonal'); // <-- Descomentado

    // Escuchar cuando el usuario escribe en el buscador
    buscador.addEventListener('input', async function () {
        const termino = this.value;

        if (termino.length < 2) {
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('show');
            return;
        }

        // --- 2. CAMBIAMOS LA URL PARA USAR EL PARÁMETRO 'term' ---
        const response = await fetch(`/Empleados/BuscarUsuarios?sUsuario=${termino}`);
        const resultados = await response.json();

        resultadosDiv.innerHTML = '';

        if (resultados.length > 0) {
            resultadosDiv.classList.add('show');

            resultados.forEach(usuario => {
                const item = document.createElement('a');
                item.classList.add('dropdown-item');
                item.href = '#';
                item.textContent = usuario.label; // ej. "Ángel Guzmán (angel) - 12345"

                // --- 3. GUARDAMOS TODOS LOS DATOS EN EL 'dataset' ---
                item.dataset.susuario = usuario.sUsuario;
                item.dataset.nnopersonal = usuario.nNoPersonal;

                // Añadir el evento de clic
                item.addEventListener('click', function (e) {
                    e.preventDefault();

                    // --- 4. RELLENAMOS TODOS LOS CAMPOS ---
                    campoUsuario.value = this.dataset.susuario;
                    campoNumPersonal.value = this.dataset.nnopersonal;

                    // Ocultar el dropdown
                    buscador.value = this.textContent;
                    resultadosDiv.innerHTML = '';
                    resultadosDiv.classList.remove('show');
                });

                resultadosDiv.appendChild(item);
            });
        } else {
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('show');
        }
    });

    // Opcional: Ocultar el dropdown si se hace clic fuera
    document.addEventListener('click', function (e) {
        if (!buscador.contains(e.target)) {
            resultadosDiv.classList.remove('show');
        }
    });
});