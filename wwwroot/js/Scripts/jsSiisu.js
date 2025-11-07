document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form-solicitud');
    if (!form) return;
    const inputsToValidate = form.querySelectorAll('input[required]');
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