document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.getElementById('especificaciones');
    const contador = document.getElementById('contador');
    const maxLength = textArea.getAttribute('maxlength');

    contador.textContent = `${maxLength}/${maxLength}`;
    contador.style.color = "#6c757d";

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
});