const recurso = "http://127.0.0.1:3001";
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');
const id2 = localStorage.getItem('id2');


const llamar = () => {
    fetch(recurso + '/cuentas2', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(json => inicio(json))
    .catch(err => console.error('Error al obtener cuentas:', err));
}

llamar();

// En el cliente

function inicio(cuentas) {
    const wrapper = document.getElementById('wrapper');
    wrapper.innerHTML = "";

    // Obtener el ID del usuario logeado desde el almacenamiento local
    const idUsuarioLogeado = localStorage.getItem('id2');

    // Filtrar las cuentas excluyendo aquellas que pertenecen al usuario logeado
    const cuentasFiltradas = cuentas.filter(cuenta => !cuenta.id_usuario || cuenta.id_usuario._id !== idUsuarioLogeado);

    cuentasFiltradas.forEach(cuenta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cuenta.iban}</td>
            <td>${cuenta.id_usuario ? `${cuenta.id_usuario.nombre} ${cuenta.id_usuario.apellido1} (${cuenta.id_usuario.dni})` : 'Usuario no disponible'}</td>
        `;

        row.addEventListener('click', () => {
            mostrarFormulario(cuenta.iban); // Llamar a mostrarFormulario con el IBAN de la cuenta
        });

        wrapper.appendChild(row);
    });
}




function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function mostrarFormulario(iban) {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';
    document.getElementById('createReceptor').value = iban;
    const url = `${recurso}/users/${id2}/accounts`;
    fetch(url, {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
    })
    .then(res => res.json())
    .then(cuentas => {
        console.log("Cuentas obtenidas:", cuentas); // Verificar los usuarios obtenidos
        const select = document.getElementById('createEmisor');
        select.innerHTML = ""; // Limpiar las opciones existentes
        cuentas.forEach(cuenta => {
            const option = document.createElement('option');
            option.value = cuenta.iban;
            option.textContent = cuenta.iban;
            select.appendChild(option);
        });
    })
    .catch(err => console.error('Error al obtener cuentas:', err));

}

// Función para cerrar el modal de creación de users
function cancelarCreacion() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'none';
}


function guardarTransferencia() {
    const nombre = document.getElementById('createNombre').value;
    const cantidad = document.getElementById('createCantidad').value;
    const concepto = document.getElementById('createConcepto').value;
    const ibanEmisor = document.getElementById('createEmisor').value;
    const ibanReceptor = document.getElementById('createReceptor').value;

    // Verificar que los elementos existen antes de acceder a sus propiedades
    if (nombre && cantidad && concepto && ibanEmisor && ibanReceptor) {
        // Crear un objeto con los datos de la transferencia
        const operacionData = {
            nombre: nombre,
            cantidad: cantidad,
            concepto: concepto,
            ibanEmisor: ibanEmisor,
            ibanReceptor: ibanReceptor,
        };

        // Enviar la solicitud POST al servidor
        fetch(recurso + '/operacion/transferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(operacionData) // Convertir el objeto a JSON antes de enviarlo
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al realizar la transferencia: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Nueva operación añadida:', data);
            // Mostrar modal de éxito
            mostrarModal('modalConfirmacion');
        })
        .catch(error => {
            console.error(error);
            // Mostrar modal de error
            mostrarModal('modalEliminación');
        });
    } else {
        console.error('Algunos elementos del formulario no existen o están vacíos.');
    }
}


// En el cliente

function mostrarModal(idModal) {
    // Cerrar el modal de formulario antes de abrir otro modal
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'none';

    // Mostrar el modal deseado
    const modal = document.getElementById(idModal);
    modal.style.display = 'block';
}



// Función para cerrar el modal
function cancelarCreacion2() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        modal.style.display = 'none';
    });
    location.reload();
}

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








