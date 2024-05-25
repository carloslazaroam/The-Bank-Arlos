document.addEventListener('DOMContentLoaded', async () => {
    const resource = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');

    await getUserData();

    async function getUserData() {
        const user = await getUserDB();
        printUser(user);
        const accounts = await getUserAccounts();
        printAccounts(accounts);

        const activeAccounts = accounts.filter(account => account.activa);

        document.getElementById('botonPanel').style.display = (accounts.length === 0 || activeAccounts.length === 0) ? 'none' : 'block';
    }

    async function getUserDB() {
        const url = `${resource}/users/${id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    async function getUserAccounts() {
        const url = `${resource}/users/${id2}/accounts`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    function printUser(userData) {
        const wrapper = document.getElementById('wrapper');
        const user = userData[0];
        wrapper.innerHTML = `
            <tr>
                <th>Id</th>
                <td>${user.id}</td>
            </tr>
            <tr>
                <td>DNI</td>
                <td>${user.dni}</td>
            </tr>
            <tr>
                <td>Usuario</td>
                <td>${user.nombre} ${user.apellido1}</td>
            </tr>
        `;
    }

    function printAccounts(accountsData) {
        const wrapper2 = document.getElementById('wrapper2');
        wrapper2.innerHTML = ""; 

        accountsData.forEach(account => {
            const activaText = account.activa ? 'activada' : 'desactivada';
            const validado = account.validado;

            wrapper2.innerHTML += `
                <tr>
                    <th>${account.nombre}</th>
                    <td>${formatDate(account.fechacreacion)}</td>
                    <td>${activaText}</td>
                    <td>
                        <div class="botonessec">
                            ${validado ? `
                                <button id="botonEditar" onclick="editarCuenta('${account.id}','${account.nombre}','${account.iban}','${account.activa}','${account.id_tipocuenta}','${account.empresa}')">
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                        <path d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </button>
                                <button id="botonOperaciones" onclick="getOperationsByAccountId('${account._id}')">
                                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                        <path d="M22 5V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5Z" stroke="#000000" stroke-width="1.5"></path>
                                        <path d="M2 12H6" stroke="#000000" stroke-width="1.5"></path>
                                        <path d="M6 3V21" stroke="#000000" stroke-width="1.5"></path>
                                        <path d="M15.5 11.5L12 14.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M17 10.01L17.01 9.99889" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </button>
                            ` : ''}
                            <button id="botonEliminar" onclick="confirmarEliminacion('${account.id}')">
                            <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                        </div>
                    </td>
                    <td>${validado ? '<span class="label label-success"><span class="glyphicon glyphicon-ok-sign">&nbsp;</span>Validada' : '<span class="label label-info"><span class="glyphicon glyphicon-time">&nbsp;</span>Pendiente'}</td>
                </tr>
            `;
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    function fetchTiposCuenta() {
        fetch(`${recurso}/tipocuentas`)
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
                    selectTipoCuenta.appendChild(option);
                });
            })
            .catch(err => console.error('Error al obtener tipos de cuenta:', err));
    }

    fetchTiposCuenta(); 
});


const recurso = "http://127.0.0.1:3001";
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');
const id2 = localStorage.getItem('id2');









function confirmarEliminacion(id) {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        eliminarCuenta(id);
        confirmModal.style.display = 'none';
    };
}






// Función para verificar el formato del IBAN
function verificarFormatoIBAN(iban) {
    document.getElementById('createIBAN').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      });
    return formatoCorrecto.test(iban);
}



// Función para modificar el párrafo según el formato del IBAN
function modificarParrafoIBAN() {
    const ibanInput = document.getElementById('createIBAN');
    const parrafoError = document.getElementById('errorIBAN');
    
    if (!verificarFormatoIBAN(ibanInput.value)) {
        parrafoError.innerHTML = 'El formato del IBAN debe ser: 1111 1111 1111 1111';
    } else {
        parrafoError.innerHTML = '';
    }
}

// Evento onclick para modificar el párrafo al hacer clic en el campo IBAN
document.getElementById('createIBAN').onclick = function() {
    const parrafoError = document.getElementById('errorIBAN');
    parrafoError.innerHTML = 'El formato del IBAN debe ser: 1111 1111 1111 1111';
};

// Evento oninput para verificar el formato del IBAN mientras el usuario escribe
document.getElementById('createIBAN').oninput = modificarParrafoIBAN;








function guardarNuevaCuenta() {
   /* const ibanInput = document.getElementById('createIBAN');
    const iban = ibanInput.value.trim(); // Eliminar espacios en blanco al principio y al final

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
    */
    // Obtener los valores de los campos del formulario

    const nombre = document.getElementById('createNombre').value; 
    const idTipocuenta = document.getElementById('createTipocuenta').value; 
    const empresa = document.getElementById('createEmpresa').value; 

    // Verificar que todos los campos estén rellenados
    if (!idTipocuenta || !empresa ||! nombre) {
        alert('Por favor, complete todos los campos del formulario.');
        return; // Detener la ejecución si hay campos vacíos
    }

    // Valores predeterminados para los campos
    const saldoPredeterminado = 0;
    const activaPredeterminado = true; // Activado por defecto
    const validadoPredeterminado = false; // Desactivado por defecto
    const iban = null;
    // Obtener el id del usuario seleccionado (No sé de dónde viene id2, así que lo mantengo como está)

    // Construir el objeto de datos de la cuenta con los valores predeterminados
    const cuentaData = {
        nombre: nombre,
        activa: activaPredeterminado,
        iban: iban,
        validado: validadoPredeterminado,
        saldo: saldoPredeterminado,
        id_usuario: id2,
        id_tipocuenta: idTipocuenta,
        empresa: empresa // Incluir el id del usuario en los datos de la cuenta
    };

    // Realizar la solicitud POST al servidor
    fetch(recurso + '/cuentas/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
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
        
        // Limpiar los campos después de guardar la nueva cuenta
        //document.getElementById('createIBAN').value = '';
        document.getElementById('createNombre').value = '';
        document.getElementById('createTipocuenta').value = '';
        document.getElementById('createEmpresa').value = '';

        // Ocultar el modal de creación y recargar la página
        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
        location.reload();
    })
    .catch(error => {
        console.error(error);
    });
}



function editarCuenta(id,nombre,iban,saldo,fechacreacion ,activa, id_tipocuenta, empresa) {
    cuentaEditando = { id,nombre,iban,saldo,fechacreacion, activa, id_tipocuenta, empresa };
    
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editIban').value = iban;
    document.getElementById('editSaldo').value = saldo;
  
    
    document.getElementById('editActiva').value;

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

    // Establecer el valor seleccionado del campo editEmpresa
    const selectEmpresa = document.getElementById('editEmpresa');
    if (cuentaEditando && cuentaEditando.empresa) {
        selectEmpresa.value = cuentaEditando.empresa;
    }

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function guardarEdicion() {
    const newNombre = document.getElementById('editNombre').value;
    const newActiva = document.getElementById('editActiva').checked;
    
    const newTipocuenta = document.getElementById('editTipocuenta').value;
    const newEmpresa = document.getElementById('editEmpresa').value;
    
    
     
    fetch(recurso + '/cuentas/' + cuentaEditando.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            activa: newActiva, // Asignar el valor booleano al campo "activa"
            id_tipocuenta: newTipocuenta,
            empresa: newEmpresa,
            nombre: newNombre
            
        
            
        })
    })
    .then(res => {
        if (res.ok) {
            document.getElementById('modal').style.display = 'none';
            location.reload();
           
        } else {
            console.error('Error al actualizar la cuenta');
        }
    })
    .catch(err => console.error('Error al actualizar la cuenta:', err));
}
document.getElementById('crearModal').style.display = 'none';

function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';

       

}

function eliminarCuenta(id) {
    fetch(recurso + '/cuentas/' + id, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            console.log('Cuenta eliminada exitosamente');
            location.reload();
            
        } else {
            console.error('Error al eliminar la cuenta');
        }
    })
    .catch(err => console.error('Error al eliminar la cuenta:', err));
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


const showModalButton = document.getElementById('showModalButton');

// Agregar un evento de clic al div para mostrar el modal
showModalButton.addEventListener('click', function() {
    mostrarConfirmModal();
});

// Función para mostrar el modal
function mostrarConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'flex';
}

// Función para cancelar la eliminación y ocultar el modal
function cancelarEliminacion() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'none';
}

function cancelarOper() {
    const confirmModal = document.getElementById('div4');
    confirmModal.style.display = 'none';
}


async function getOperationsByAccountId(accountId) {
    try {
        const response = await fetch(`${recurso}/operaciones/cuenta/${accountId}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener las operaciones asociadas a la cuenta ${response.status}`);
        }
        
        const data = await response.json(); 
        console.log(data)// Espera a que se resuelva la promesa y obtén los datos
        mostrarOperacionesEnModal(data); // Llama a la función para mostrar las operaciones en el modal
    } catch (error) {
        console.error("Error al obtener las operaciones asociadas a la cuenta:", error);
        return []; // Devolvemos un array vacío en caso de error
    }
}


function mostrarOperacionesEnModal(operaciones) {
    const wrapper = document.getElementById('wrapper4');
    wrapper.innerHTML = ""; // Limpiar el contenedor antes de imprimir las operaciones
    let count = 1; 
    operaciones.forEach(operacion => {

        
        // Construir el HTML para cada operación y agregarlo al contenedor
        wrapper.innerHTML += `
            <tr>
                <th>Operación ${count}</th>
                <td>${operacion.cantidad}</td>
                <td>${operacion.concepto}</td>
                <td>${operacion.fecha}</td>
                <td>${operacion.nombre}</td>
                <td>${operacion.tipo}</td>
            </tr>
        `;

        count++
    });

    // Mostrar el modal después de haber agregado las operaciones al contenedor
    const modal = document.getElementById('div4');
    modal.style.display = 'block';
}


