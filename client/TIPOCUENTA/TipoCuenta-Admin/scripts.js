const recurso = "http://127.0.0.1:3001";

const llamar = () => {
    fetch(recurso + '/tipocuentas')
        .then(res => res.json())
        .then(json => inicio(json))
        .catch(err => console.error('Error al obtener tipos de cuenta:', err));
}

llamar();

function inicio(tipocuentas) {
    const wrapper = document.getElementById('wrapper');
    console.log(tipocuentas);
    wrapper.innerHTML = "";
    tipocuentas.forEach(tipocuenta => {
        wrapper.innerHTML += `
        
            <tr>
            
                <td>${tipocuenta.nombre}</td>
                <td>${tipocuenta.porcentajebeneficio}%</td>
                <td>${tipocuenta.maxnegativo}</td>
                
                
                <td>
                    <button id="botonEliminar" onclick="confirmarEliminacion('${tipocuenta.nombre}')">
                    <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button id="botonEditar"onclick="editarTipocuenta('${tipocuenta.nombre}','${tipocuenta.porcentajebeneficio}', '${tipocuenta.maxnegativo}')">
                    <?xml version="1.0" encoding="UTF-8"?>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    </button>
                </td>
            </tr>`;
    });
}


// Función para abrir el modal de confirmación de eliminación
function confirmarEliminacion(nombre) {
    // Mostrar el modal de confirmación
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    
    // Configurar el botón de confirmar para enviar la solicitud DELETE
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        eliminarTipocuenta(nombre);
        confirmModal.style.display = 'none'; // Ocultar el modal después de confirmar
    };
}




// Agrega una variable global para almacenar el título del user que se está editando
let tipocuentaEditando = null;

// Función para abrir el modal de edición con los datos del usuario seleccionado
function editarTipocuenta(nombre,porcentajebeneficio,maxnegativo) {
    // Almacenar los datos del usuario que se está editando
    tipocuentaEditando = { nombre,porcentajebeneficio,maxnegativo };
    
    // Llenar el formulario de edición con los datos del usuario
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editPorcentaje').value = porcentajebeneficio;
    document.getElementById('editMax').value = maxnegativo;
    
    // Mostrar el modal de edición
    const modal = document.getElementById('modal');
    modal.style.display = 'block'; // Asegúrate de que el modal se muestre
    console.log('Modal de edición abierto'); // Agrega un mensaje de consola para verificar si el modal se abre correctamente
}

// Función para enviar la solicitud de actualización al servidor
function guardarEdicion() {
    // Obtener los nuevos datos del usuario desde el formulario
    const newNombre = document.getElementById('editNombre').value;
    const newPorcentaje = document.getElementById('editPorcentaje').value;
    const newMaxnegativo = document.getElementById('editMax').value;
    
    // Enviar la solicitud de actualización al servidor
    fetch(recurso + '/tipocuentas/' + tipocuentaEditando.nombre, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: newNombre,
            porcentajebeneficio: newPorcentaje,
            maxnegativo: newMaxnegativo,
            
            // Conservamos el valor original del país
        })
    })
    .then(res => {
        if (res.ok) {
            // Cerrar el modal después de la actualización exitosa
            document.getElementById('modal').style.display = 'none';
            llamar(); // Volver a cargar la lista de usuarios después de actualizar uno
        } else {
            console.error('Error al actualizar el usuario');
        }
    })
    .catch(err => console.error('Error al actualizar el usuario:', err));
}


// Función para cerrar el modal de edición
function cancelarEdicion() {
    // Limpiar los datos del user en edición
    tipocuentaEditando = null;
    
    // Ocultar el modal con animación de opacidad
    const modal = document.getElementById('modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '1'; // Restablecer la opacidad para futuras aperturas
    }, 500); // El mismo tiempo que la duración de la animación
}
function cancelarEliminacion() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'none';
}


// Función para mostrar el modal de creación de users
function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';
}

// Función para cerrar el modal de creación de users
function cancelarCreacion() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'none';
}

// Función para enviar la solicitud de creación de un nuevo user al servidor

function guardarNuevoTipocuenta() {
    const nombre = document.getElementById('createNombre').value;
    const porcentajebeneficio = document.getElementById('createPorcentaje').value;
    const maxnegativo = document.getElementById('createMax').value;
    
    
    // Crear un objeto con los datos del usuario
    const tipocuentaData = {
        nombre: nombre,
        porcentajebeneficio: porcentajebeneficio,
        maxnegativo: maxnegativo,
        
    };

    // Enviar la solicitud POST al servidor
    fetch(recurso + '/tipocuentas/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipocuentaData) // Convertir el objeto a JSON antes de enviarlo
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir el tipo de cuenta: ' + response.status + ' ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Nuevo tipo de cuenta añadido:', data);
        // Actualizar la interfaz con el nuevo user
        llamar();
        
        // Limpiar el formulario después de añadir el user
        document.getElementById('createNombre').value = '';
        document.getElementById('createPorcentaje').value = '';
        document.getElementById('createMax').value = '';
        
        
        // Cerrar el modal de creación de users
        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
    });
}


document.getElementById('crearModal').style.display = 'none';

function eliminarTipocuenta(nombre) {
    fetch(recurso + '/tipocuentas/' + nombre, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            console.log('Tipo de cuenta eliminado exitosamente');
            llamar(); // Recargar la lista de usuarios después de eliminar uno
        } else {
            console.error('Error al eliminar el tipo de cuenta');
        }
    })
    .catch(err => console.error('Error al eliminar el tipocuenta:', err));
}


function buscarPorNombre() {
    // Obtenemos el valor del input de búsqueda
    const input = document.getElementById('searchInput');
    const filtro = input.value.toUpperCase();

    // Obtenemos la tabla y las filas de la tabla
    const tabla = document.getElementById('wrapper');
    const filas = tabla.getElementsByTagName('tr');

    // Iteramos sobre todas las filas y ocultamos aquellas que no coincidan con el filtro
    for (let i = 0; i < filas.length; i++) {
        const celdaNombre = filas[i].getElementsByTagName('td')[0]; // La primera celda contiene el nombre
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
