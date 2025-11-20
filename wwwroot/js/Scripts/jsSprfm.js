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
});