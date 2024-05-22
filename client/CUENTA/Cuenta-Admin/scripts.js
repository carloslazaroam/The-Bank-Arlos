const recurso = "http://127.0.0.1:3001";

const token = localStorage.getItem('token');

const llamar = () => {
    fetch(recurso + '/cuentas',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(json => inicio(json))
        .catch(err => console.error('Error al obtener usuarios:', err));
}

llamar();

function inicio(cuentas) {
    const wrapper = document.getElementById('wrapper');
    console.log(cuentas);
    wrapper.innerHTML = "";
    cuentas.forEach(cuenta => {
        let formattedIBAN = "";
        if (cuenta.iban !== null) {
            formattedIBAN = cuenta.iban.replace(/(.{4})/g, '$1 ').trim();
        } else {
            formattedIBAN = "IBAN vacío"; // Mostrar un mensaje si el IBAN es null
        }
        
        wrapper.innerHTML += `
            <tr>
                <td style="font-family: Imaki;margin: 0 auto">${cuenta.id}</td>
                <td>${cuenta.nombre}</td>
                <td>${formattedIBAN}</td>
                <td>${formatDate(cuenta.fechacreacion)}</td>
                <td>${cuenta.id_usuario}</td> <!-- Mostrar solo el ID del usuario -->
                <td>${cuenta.activa}</td>
                <td>${cuenta.saldo}€</td>
                <td>${cuenta.validado ? '<span class="label label-success"><span class="glyphicon glyphicon-ok-sign">&nbsp;</span>Validada' : '<span class="label label-info"><span class="glyphicon glyphicon-time">&nbsp;</span>Pendiente'}</td>
                <td>
                    <button id="botonEliminar" onclick="confirmarEliminacion('${cuenta.iban}')">
                    <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button id="botonEditar" onclick="editarCuenta('${cuenta.id}','${cuenta.iban}','${cuenta.validado}')">
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


function confirmarEliminacion(id) {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        eliminarCuenta(id);
        confirmModal.style.display = 'none';
    };
}

let cuentaEditando = null;

function editarCuenta(id,iban, validado) {
    cuentaEditando = {id, iban,validado};

    document.getElementById('editIban').value = iban;
    document.getElementById('editValidado').checked = validado;
    

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}



function verificarFormatoIBAN(iban) {
    document.getElementById('editIban').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      });
    return formatoCorrecto.test(iban);
}



// Función para modificar el párrafo según el formato del IBAN
function modificarParrafoIBAN() {
    const ibanInput = document.getElementById('editIban');
    const parrafoError = document.getElementById('errorIBAN');
    
    if (!verificarFormatoIBAN(ibanInput.value)) {
        parrafoError.innerHTML = 'El formato del IBAN debe ser: 1111 1111 1111 1111';
    } else {
        parrafoError.innerHTML = '';
    }
}

// Evento onclick para modificar el párrafo al hacer clic en el campo IBAN
document.getElementById('editIban').onclick = function() {
    const parrafoError = document.getElementById('errorIBAN');
    parrafoError.innerHTML = 'El formato del IBAN debe ser: 1111 1111 1111 1111';
};

// Evento oninput para verificar el formato del IBAN mientras el usuario escribe
document.getElementById('editIban').oninput = modificarParrafoIBAN;



function guardarEdicion() {
    const ibanInput = document.getElementById('editIban');
    const iban = ibanInput.value.trim(); // Obtener el valor del input

    // Verificar que el IBAN tenga exactamente 16 caracteres numéricos
    if (!(/^\d{16}$/.test(iban))) {
        document.getElementById('errorIBAN').textContent = '* El IBAN debe tener 16 dígitos numéricos. (No puedes poner espacios)';
        return;
    }

    // Formatear el IBAN con espacios cada 4 dígitos
    const formattedIBAN = iban.replace(/(.{4})/g, '$1 ').trim();

    // Asignar el IBAN formateado al campo de entrada
    ibanInput.value = formattedIBAN;

    // Restablecer el mensaje de error
    document.getElementById('errorIBAN').textContent = '';

    const newValidado = document.getElementById('editValidado').checked; 

    fetch(recurso + '/cuentas/' + cuentaEditando.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            iban: iban, // Enviar el valor del IBAN obtenido del input
            validado: newValidado,
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

function eliminarCuenta(id) {
    fetch(recurso + '/cuentas/' + id, {
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
    const validado = document.getElementById('createValidacion').checked;
    const saldo = document.getElementById('createSaldo').value;
    const idUsuario = document.getElementById('createUsuario').value;
    const idTipocuenta = document.getElementById('createTipocuenta').value; // Obtener el id del usuario seleccionado

    const cuentaData = {
        activa: activa,
        iban: iban,
        validado: validado,
        saldo: saldo,
        id_usuario: idUsuario,
        id_tipocuenta: idTipocuenta // Incluir el id del usuario en los datos de la cuenta
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
        document.getElementById('createValidacion').checked = false;
        document.getElementById('createSaldo').value = '';
        document.getElementById('createUsuario').value = '';
        document.getElementById('createTipocuenta').value = '';

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

    fetch(recurso + '/users', {
        headers: {
            'Authorization': `Bearer ${token}` // Incluir el token JWT en el encabezado de autorización
        }
    })
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
    


        fetch(recurso + '/tipocuentas')
        .then(res => {
            if (!res.ok) {
                throw new Error('No se pudieron obtener los tipos de cuenta');
            }
            return res.json();
        })
        .then(tiposCuenta => {
            console.log("Tipos de cuenta obtenidos:", tiposCuenta);
            const selectTipoCuenta = document.getElementById('createTipocuenta');
            selectTipoCuenta.innerHTML = "";
            tiposCuenta.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo._id;
                option.textContent = tipo.nombre;
                if (cuentaEditando && cuentaEditando.id_tipocuenta && tipo._id.toString() === cuentaEditando.id_tipocuenta.toString()) {
                    option.selected = true;
                }
                selectTipoCuenta.appendChild(option);
            });
        })
        .catch(err => console.error('Error al obtener tipos de cuenta:', err));


}






