const recurso = "http://127.0.0.1:3001";

const llamar = () => {
    fetch(recurso + '/cuentas')
        .then(res => res.json())
        .then(json => inicio(json))
        .catch(err => console.error('Error al obtener cuentas:', err));
}

llamar();

function inicio(cuentas) {
    const wrapper = document.getElementById('wrapper');
    console.log(cuentas);
    wrapper.innerHTML = "";
    cuentas.forEach(cuenta => {
        wrapper.innerHTML += `
        
            <tr>
                <td style="font-family: Imaki;margin: 0 auto">${cuenta.id}</td>
                <td>${formatDate(cuenta.fechacreacion)}</td>
                <td>${cuenta.activa}</td>
                <td>${cuenta.iban}</td>
                
                <td>
                    <button id="botonEliminar" onclick="confirmarEliminacion('${cuenta.iban}')">
                        <?xml version="1.0" encoding="UTF-8"?>
                        <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <button id="botonEditar" onclick="editarCuenta('${cuenta.iban}', '${cuenta.fechacreacion}', '${cuenta.activa}')">
                        <?xml version="1.0" encoding="UTF-8"?>
                        <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </td>
            </tr>`;
    });
}

// Función para formatear la fecha en un formato legible por humanos
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}


function confirmarEliminacion(iban) {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        eliminarCuenta(iban);
        confirmModal.style.display = 'none';
    };
}

let cuentaEditando = null;

function editarCuenta(iban, activa) {
    cuentaEditando = { iban, activa };
    
    document.getElementById('editActiva').checked = activa; 
    document.getElementById('editIban').value = iban;

    // Llenar el campo editUsuario con opciones disponibles y seleccionar el usuario actual
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(users => {
            console.log("Usuarios obtenidos:", users); // Verificar los usuarios obtenidos
            const select = document.getElementById('editUsuario');
            select.innerHTML = ""; // Limpiar las opciones existentes
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user._id;
                option.textContent = user.nombre + ' ' + user.apellido1 + ' ' + user.apellido2;
                select.appendChild(option);
            });

            // Obtener el id_usuario de la cuenta actual y seleccionarlo en el desplegable
            fetch(recurso + '/cuentas/' + cuentaEditando.iban)
                .then(res => res.json())
                .then(cuenta => {
                    document.getElementById('editUsuario').value = cuenta.id_usuario;
                })
                .catch(err => console.error('Error al obtener la cuenta:', err));
        })
        .catch(err => console.error('Error al obtener usuarios:', err));

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}





function guardarEdicion() {
   
    const newActiva = document.getElementById('editActiva').checked; // Obtener el valor booleano de la casilla de verificación
    const newIban = document.getElementById('editIban').value;
     
    fetch(recurso + '/cuentas/' + cuentaEditando.iban, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          
            activa: newActiva, // Asignar el valor booleano al campo "activa"
            iban: newIban
        })
    })
    .then(res => {
        if (res.ok) {
            document.getElementById('modal').style.display = 'none';
            llamar();
        } else {
            console.error('Error al actualizar la cuenta');
        }
    })
    .catch(err => console.error('Error al actualizar la cuenta:', err));
}


function cancelarEdicion() {
    cuentaEditando = null;
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function cancelarEliminacion() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'none';
}

function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';
}

function cancelarCreacion() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'none';
}

function eliminarCuenta(iban) {
    fetch(recurso + '/cuentas/' + iban, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            console.log('Cuenta eliminada exitosamente');
            llamar();
        } else {
            console.error('Error al eliminar la cuenta');
        }
    })
    .catch(err => console.error('Error al eliminar la cuenta:', err));
}

function guardarNuevaCuenta() {
    const activa = document.getElementById('createActiva').checked;
    const iban = document.getElementById('createIBAN').value;
    const idUsuario = document.getElementById('createUsuario').value; // Obtener el id del usuario seleccionado

    const cuentaData = {
        activa: activa,
        iban: iban,
        id_usuario: idUsuario // Incluir el id del usuario en los datos de la cuenta
    };

    fetch(recurso + '/cuentas/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cuentaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir la cuenta: ' + response.status + ' ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Nueva cuenta añadida:', data);
        llamar();
        
        // Limpiar los campos después de guardar la nueva cuenta
        document.getElementById('createActiva').checked = false;
        document.getElementById('createIBAN').value = '';
        document.getElementById('createUsuario').value = '';

        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
    });
}


document.getElementById('crearModal').style.display = 'none';



function buscarPorNombre() {
    const input = document.getElementById('searchInput');
    const filtro = input.value.toUpperCase();

    const tabla = document.getElementById('wrapper');
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdaNombre = filas[i].getElementsByTagName('td')[0];
        if (celdaNombre) {
            const textoCelda = celdaNombre.textContent || celdaNombre.innerText;
            if (textoCelda.toUpperCase().indexOf(filtro) > -1) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }
    }
}

function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';

    // Llenar el desplegable con opciones de usuarios disponibles
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(users => {
            console.log("Usuarios obtenidos:", users); // Verificar los usuarios obtenidos
            const select = document.getElementById('createUsuario');
            select.innerHTML = ""; // Limpiar las opciones existentes
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user._id;
                option.textContent = user.nombre + ' ' + user.apellido1 + ' ' + user.apellido2;
                select.appendChild(option);
            });
        })
        .catch(err => console.error('Error al obtener usuarios:', err));
}







