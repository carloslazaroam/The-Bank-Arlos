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
        wrapper.innerHTML += `
            <tr>
                <td style="font-family: Imaki;margin: 0 auto">${cuenta.id}</td>
                <td>${cuenta.iban}</td>
                <td>${formatDate(cuenta.fechacreacion)}</td>
                <td>${cuenta.id_usuario}</td> <!-- Mostrar solo el ID del usuario -->
                <td>${cuenta.activa}</td>
                <td>${cuenta.saldo}€</td>
                <td>${cuenta.validado ? '<span class="label label-success"><span class="glyphicon glyphicon-ok-sign">&nbsp;</span>Validada' : '<span class="label label-info"><span class="glyphicon glyphicon-time">&nbsp;</span>Pendiente'}</td>
                <td>
                    <button id="botonEliminar" onclick="confirmarEliminacion('${cuenta.iban}')">
                        <!-- Botón de eliminar -->
                    </button>
                    <button id="botonEditar" onclick="editarCuenta('${cuenta.iban}', '${cuenta.fechacreacion}', '${cuenta.activa}','${cuenta.id_usuario}','${cuenta.saldo}','${cuenta.validado}','${cuenta.id_tipocuenta}')">
                        <!-- Botón de editar -->
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

function editarCuenta(iban, activa,saldo,validado, id_usuario,id_tipocuenta) {
    cuentaEditando = { iban, activa,saldo,validado, id_usuario,id_tipocuenta };

    document.getElementById('editActiva').checked = activa;
    document.getElementById('editValidado').checked = validado;
    document.getElementById('editSaldo').checked = saldo;
    document.getElementById('editIban').value = iban;

    // Llenar el campo editUsuario con opciones disponibles y seleccionar el usuario actual
    fetch(recurso + '/users', {
        headers: {
            'Authorization': `Bearer ${token}` // Incluir el token JWT en el encabezado de autorización
        }
    })
    .then(res => res.json())
    .then(users => {
        console.log("Usuarios obtenidos:", users); // Verificar los usuarios obtenidos
        const select = document.getElementById('editUsuario');
        select.innerHTML = ""; // Limpiar las opciones existentes
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.textContent = user.nombre + ' ' + user.apellido1 + ' ' + user.apellido2;
            if (user._id.toString() === id_usuario.toString()) {
                option.selected = true; // Seleccionar automáticamente el usuario asignado a la cuenta
            }
            select.appendChild(option);
        });
    })
    .catch(err => console.error('Error al obtener usuarios:', err));
    

        // Llenar el campo editTipoCuenta con opciones disponibles y seleccionar el tipo de cuenta actual
        fetch(recurso + '/tipocuentas')
        .then(res => {
            if (!res.ok) {
                throw new Error('No se pudieron obtener los tipos de cuenta');
            }
            return res.json();
        })
        .then(tiposCuenta => {
            console.log("Tipos de cuenta obtenidos:", tiposCuenta);
            const selectTipoCuenta = document.getElementById('editTipocuenta');
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
    

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}







function guardarEdicion() {
   
    const newActiva = document.getElementById('editActiva').checked;
   
    const newSaldo = document.getElementById('editSaldo').value// Obtener el valor booleano de la casilla de verificación
    const newIban = document.getElementById('editIban').value;
    const newValidado = document.getElementById('editValidado').checked; 
    const newUsuario = document.getElementById('editUsuario').value;
    const newTipocuenta = document.getElementById('editTipocuenta').value;
    
     
    fetch(recurso + '/cuentas/' + cuentaEditando.iban, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          
            activa: newActiva, // Asignar el valor booleano al campo "activa"
            iban: newIban,
            validado: newValidado,
            saldo: newSaldo,
            id_usuario: newUsuario,
            id_tipocuenta: newTipocuenta
            
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






