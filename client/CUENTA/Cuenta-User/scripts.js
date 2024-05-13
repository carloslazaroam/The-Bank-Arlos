window.addEventListener('DOMContentLoaded', () => {
    const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');

    

    getUserData();
    

    getUserData();
    async function getUserData() {
        const user = await getUserDB();
        printUser(user);
        const cuentas = await getUserAccounts(); // Obtener cuentas del usuario
        printAccounts(cuentas);
        
    }

    async function getUserDB() {
        const url = `${recurso}/users/${id}`;
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
        const url = `${recurso}/users/${id2}/accounts`; // Cambio en la ruta para obtener cuentas del usuario
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
        wrapper.innerHTML = "";
        wrapper.innerHTML += `
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
        wrapper2.innerHTML = ""; // Limpiar el contenedor antes de imprimir las cuentas
        
        let count = 1; // Inicializar el contador
        
        accountsData.forEach(account => {
            const activaText = account.activa ? 'activada' : 'desactivada';
            wrapper2.innerHTML += `
            
                <tr>
                
                    <th>Cuenta ${count}</th> <!-- Utilizar el contador en lugar de un número fijo -->
                    <td>${account.iban}</td>
                    <td>${formatDate(account.fechacreacion)}</td>
                    <td>${activaText}</td>
                    <td><button id="botonEditar" onclick="editarCuenta('${account.iban}','${account.activa}','${account.id_tipocuenta}','${account.empresa}')"> <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                
                <button id="botonEliminar" onclick="confirmarEliminacion('${account.iban}')">
                    <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </td>
                    
            
                </tr>
                

                
                    
                    
            `;
            count++; // Incrementar el contador para la próxima iteración
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

function confirmarEliminacion(iban) {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        eliminarCuenta(iban);
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
    // Valores predeterminados para los campos
    const saldoPredeterminado = 0;
    const activaPredeterminado = true; // Activado por defecto
    const validadoPredeterminado = false; // Desactivado por defecto
    
    // Obtener los valores de los campos del formulario
    const iban = document.getElementById('createIBAN').value;
    const idTipocuenta = document.getElementById('createTipocuenta').value; 
    const empresa = document.getElementById('createEmpresa').value; 
    
    // Obtener el id del usuario seleccionado (No sé de dónde viene id2, así que lo mantengo como está)

    // Construir el objeto de datos de la cuenta con los valores predeterminados
    const cuentaData = {
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
        document.getElementById('createIBAN').value = '';
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











function editarCuenta(iban, activa, id_tipocuenta, empresa) {
    cuentaEditando = { iban, activa, id_tipocuenta, empresa };

    document.getElementById('editActiva').checked = activa;

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
    const newIban = document.getElementById('editIban').value;
    const newActiva = document.getElementById('editActiva').checked;
    const newTipocuenta = document.getElementById('editTipocuenta').value;
    const newEmpresa = document.getElementById('editEmpresa').value;
    
    
     
    fetch(recurso + '/cuentas/' + cuentaEditando.iban, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            iban: newIban,
            activa: newActiva, // Asignar el valor booleano al campo "activa"
            id_tipocuenta: newTipocuenta,
            empresa: newEmpresa,
            
        
            
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

function eliminarCuenta(iban) {
    fetch(recurso + '/cuentas/' + iban, {
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
