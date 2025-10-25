function inputPassword(e) {
    if (e.code == "Enter") {
        e.preventDefault();
        togglePassword();
    }
}

function alternarContrasena() {
    const passwordField = document.getElementById("sContrasena");
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