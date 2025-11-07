//test
function inputPassword(e) {
    if (e.code == "Enter") {
        e.preventDefault();
        togglePassword();
    }
}

function alternarContrasena() {
    const passwordField = document.getElementById("txtContra");
    const icon = document.getElementById("contrasenaIcono");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        passwordField.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}

let iniciando = false;
document.getElementById("form-login").addEventListener("submit", function () {
    if (iniciando) {
        e.preventDefault();
        return;
    }

    iniciando = true;

    const btn = document.getElementById("btn-login");
    btn.disabled = true;
    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span> Iniciando sesión
    `;
});