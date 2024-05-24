 
const recurso = "http://127.0.0.1:3001";
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

document.getElementById("modal").style.display = "none";

// Agrega un evento al botón de aceptar del modal para cerrarlo
document.getElementById("modalAceptarBtn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});




document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button');

    loginButton.addEventListener('click', async () => {
        const dni = document.getElementById('logeo').value;
        const password = document.getElementById('contrao').value;

        // Verifica si algún campo está vacío
        if (!dni || !password) {
            alert('Por favor, complete todos los campos.');
            return null;
        }

        

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
        const modal = document.getElementById('modal');
    modal.style.display = 'block';
    } else {
        // Cambiar la alerta por la visualización del modal
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        
        // Event listener para el botón de aceptar del modal
        const modalAceptarBtn = document.getElementById('modalAceptarBtn');
        modalAceptarBtn.addEventListener('click', () => {
            if (data.usertype === '6632844e043b8bf3927f1aed') {
                window.location.href = '../USER/User-Admin/userAdmin.html';
            } else {
                window.location.href = '../HOME/home.html';
            }
        });
    }
} else {
    alert(data.message);
}
    });

    const registroForm = document.getElementById('registroForm');
    const dniInput = document.getElementById("registroDNI");
    const holamundo = document.getElementById("holamundo");

    // Función para validar el formato del DNI
function validarFormatoDNI(dni) {
    // El DNI debe tener 9 caracteres, los primeros 8 son dígitos y el último es una letra
    const dniRegex = /^\d{8}[a-zA-Z]$/;
    return dniRegex.test(dni);
}

    
    dniInput.addEventListener('input', () => {
        const dni = dniInput.value;
        const dniContainer = dniInput.parentNode;
    
        // Verifica si el campo del DNI está vacío
        if (dni.trim() === "") {
            return;
        }
    
        // Verifica el formato del DNI
        if (!validarFormatoDNI(dni)) {
            holamundo.innerHTML = "El DNI tiene 8 números y una letra";
        } else {
            limpiarError(dniContainer);
            holamundo.innerHTML = ""; // Limpiar el mensaje cuando el formato es válido
        }
    });

    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        // Evita el envío automático del formulario
       

    // Verifica si el formato del DNI es válido
  
    
        // Obtén los valores de los campos
        const dni = document.getElementById("registroDNI").value;
        const email = document.getElementById("registroEmail").value;
        if (!validarFormatoDNI(dni)) {
            alert('El formato del DNI no es válido. Debe tener 8 números seguidos de una letra.');
            return; // Sale de la función si el formato no es válido
        }
        const nombre = document.getElementById("registroNombre").value;
        const contraseña = document.getElementById("registroContraseña").value;
        const confirmarContraseña = document.getElementById("confirmarContraseña").value;
        const apellido1 = document.getElementById("registroApellido1").value;
        const apellido2 = document.getElementById("registroApellido2").value;
        const direccion = document.getElementById("registroDireccion").value;
        const pais = document.getElementById("registroPais").value;
    
        // Verifica si algún campo está vacío
        if (!dni || !email || !nombre || !contraseña || !confirmarContraseña || !apellido1 || !apellido2 || !direccion || !pais) {
            alert('Por favor, complete todos los campos.');
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
                body: JSON.stringify({ dni,email, nombre, contra: contraseña, apellido1, apellido2, direccion, pais })
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
            document.getElementById("registroEmail").value = "";
            document.getElementById("registroNombre").value = "";
            document.getElementById("registroContraseña").value = "";
            document.getElementById("confirmarContraseña").value = "";
            document.getElementById("registroApellido1").value = "";
            document.getElementById("registroApellido2").value = "";
            document.getElementById("registroDireccion").value = "";
            document.getElementById("registroPais").value = "";
        }
    });
    


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


    const guardarBtn = document.getElementById('guardarBtn');

// Agrega un controlador de eventos al botón "Guardar"
guardarBtn.addEventListener('click', async () => {
    // Obtén los valores del correo electrónico y el DNI
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;

    // Realiza una solicitud POST al servidor para recuperar la contraseña
    try {
        const response = await fetch(recurso + '/forgotpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, dni: dni }) // Envía el correo electrónico y el DNI al servidor
        });

        // Verifica si la solicitud fue exitosa
        if (response.ok) {
            alert('Correo de recuperación enviado correctamente');
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('Error interno del cliente al enviar la solicitud');
    }
});

 
   
});
function abrirModalRecuperacion() {
    var modalRecuperacion = document.getElementById('crearModalRecuperacion');
    modalRecuperacion.style.display = 'block';
}

function cancelarCreacion() {
    var modalRecuperacion = document.getElementById('crearModalRecuperacion');
    modalRecuperacion.style.display = 'none';
}

