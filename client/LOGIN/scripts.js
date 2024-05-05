 const banner = document.getElementById("banner")
const loginContainer = document.getElementById("login-container")
const signupContainer = document.getElementById("signup-container")
const loginToggle = document.getElementById("login-form-toggler")
const signupToggle = document.getElementById("signup-form-toggler")

signupToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(-100%)";
    loginContainer.style.transform = "scale(0)";
    signupContainer.style.transform = "scale(1)"
})
loginToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(0%)"
    signupContainer.style.transform = "scale(0)"
    loginContainer.style.transform = "scale(1)"
})



document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button');

    loginButton.addEventListener('click', async () => {
        const dni = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dni, contra: password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.id);
            localStorage.setItem('dni', data.dni);
            localStorage.setItem('id2', data.id2);
            
            console.log(data.dni);
            console.log(data.id2);
            if (data.validado === false) { // Verifica si el usuario está validado
                alert('No tienes acceso. Tu cuenta aún no ha sido validada por un administrador.');
            } else {
                alert('Inicio de sesión exitoso');
                if (data.usertype === '6632844e043b8bf3927f1aed') {
                    window.location.href = '../USER/User-Admin/userAdmin.html';
                } else {
                    window.location.href = '../HOME/home.html';
                }
            }
        } else {
            alert(data.message);
        }
    });

    const registroForm = document.getElementById('registroForm');

    const dniInput = document.getElementById("registroDNI");

    dniInput.addEventListener('input', () => {
        const dni = dniInput.value;
        const dniContainer = dniInput.parentNode;

        // Verifica si el campo del DNI está vacío
        if (dni.trim() === "") {
            return;
        }

        // Verifica el formato del DNI
        if (!validarFormatoDNI(dni)) {
            mostrarError(dniContainer, 'El DNI debe tener 9 caracteres.');
        } else {
            limpiarError(dniContainer);
        }
    });

    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío automático del formulario
    
        // Obtén los valores de los campos
        const dni = document.getElementById("registroDNI").value;
        const nombre = document.getElementById("registroNombre").value;
        const contraseña = document.getElementById("registroContraseña").value;
        const confirmarContraseña = document.getElementById("confirmarContraseña").value;
        const apellido1 = document.getElementById("registroApellido1").value;
        const apellido2 = document.getElementById("registroApellido2").value;
        const direccion = document.getElementById("registroDireccion").value;
        const pais = document.getElementById("registroPais").value;
    
        // Verifica si algún campo está vacío
        if (!dni || !nombre || !contraseña || !confirmarContraseña || !apellido1 || !apellido2 || !direccion || !pais) {
            alert('Por favor, complete todos los campos.');
            return null;
        }
    
        // Verifica el formato del DNI
        if (!validarFormatoDNI(dni)) {
            alert('El DNI debe tener 9 caracteres');
            location.reload();
            // Después de un envío fallido, puedes restablecer los valores manualmente
            document.getElementById("registroDNI").value = "";
            document.getElementById("registroNombre").value = "";
            document.getElementById("registroContraseña").value = "";
            document.getElementById("confirmarContraseña").value = "";
            document.getElementById("registroApellido1").value = "";
            document.getElementById("registroApellido2").value = "";
            document.getElementById("registroDireccion").value = "";
            document.getElementById("registroPais").value = "";
            return null;
        }
    
        // Verifica si las contraseñas coinciden
        if (contraseña !== confirmarContraseña) {
            alert('Las contraseñas no coinciden.');
            return null;
        }
    
        // Si todos los campos están llenos y el formato del DNI es válido, y las contraseñas coinciden, envía el formulario
        try {
            const response = await fetch('http://localhost:3001/users/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dni, nombre, contra: contraseña, apellido1, apellido2, direccion, pais })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Usuario registrado exitosamente');
                document.getElementById("registroForm").reset();
                location.reload(); // Recarga la página en caso de éxito
            } else {
                throw new Error(data.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
            alert('Error al registrar usuario: ' + error.message);
            location.reload();
            // Después de un envío fallido, puedes restablecer los valores manualmente
            document.getElementById("registroDNI").value = "";
            document.getElementById("registroNombre").value = "";
            document.getElementById("registroContraseña").value = "";
            document.getElementById("confirmarContraseña").value = "";
            document.getElementById("registroApellido1").value = "";
            document.getElementById("registroApellido2").value = "";
            document.getElementById("registroDireccion").value = "";
            document.getElementById("registroPais").value = "";
 // Recarga la página en caso de error
        }
    });

    // Función para validar el formato del DNI
    function validarFormatoDNI(dni) {
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        return dniRegex.test(dni);
    }

    // Función para mostrar un mensaje de error
    function mostrarError(container, message) {
        const errorElement = container.querySelector('.error-message');
        if (!errorElement) {
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = message;
            container.appendChild(errorMessage);
        }
    }

    // Función para limpiar el mensaje de error
    function limpiarError(container) {
        const errorElement = container.querySelector('.error-message');
        if (errorElement) {
            container.removeChild(errorElement);
        }
    }

    const confirmarContraseñaInput = document.getElementById("confirmarContraseña");

    confirmarContraseñaInput.addEventListener('input', () => {
        const contraseña = document.getElementById("registroContraseña").value;
        const confirmarContraseña = confirmarContraseñaInput.value;
        const confirmarContraseñaContainer = confirmarContraseñaInput.parentNode;

        // Verifica si hay contenido en ambos campos de contraseña
        if (contraseña.trim() !== "" && confirmarContraseña.trim() !== "") {
            if (contraseña === confirmarContraseña) {
                confirmarContraseñaInput.style.backgroundColor = 'lightgreen'; // Contraseñas coinciden, fondo verde
            } else {
                confirmarContraseñaInput.style.backgroundColor = 'lightcoral'; // Contraseñas no coinciden, fondo rojo
            }
        } else {
            confirmarContraseñaInput.style.backgroundColor = ''; // Vaciar el color de fondo si falta contenido en algún campo
        }
    });

   
});
