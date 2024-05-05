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
            wrapper2.innerHTML += `
                <tr>
                    <th>Cuenta ${count}</th> <!-- Utilizar el contador en lugar de un número fijo -->
                    <td>${account.iban}</td>
                    <td>${formatDate(account.fechacreacion)}</td> <!-- Imprimir el campo iban -->
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

let cuentaEditando = null;

function guardarNuevaCuenta() {
    const activa = document.getElementById('createActiva').checked;
    const iban = document.getElementById('createIBAN').value;
    const validado = document.getElementById('createValidacion').checked;
    const saldo = document.getElementById('createSaldo').value;
    const idTipocuenta = document.getElementById('createTipocuenta').value; 
    
    if (!iban.match(/[A-Z]{4}-[A-Z]{4}-[A-Z]{4}/)) {
        // Mostrar un mensaje de error si el formato del IBAN no es válido
        alert("El formato del IBAN no es válido. Debe ser XXXX-XXXX-XXXX.");
        ibanInput.focus(); // Hacer foco en el input para corregir el valor
        return; // Detener el proceso de guardar la cuenta
    }// Obtener el id del usuario seleccionado

    const cuentaData = {
        activa: activa,
        iban: iban,
        validado: validado,
        saldo: saldo,
        id_usuario: id2,
        id_tipocuenta: idTipocuenta // Incluir el id del usuario en los datos de la cuenta
    };

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
        document.getElementById('createActiva').checked = false;
        document.getElementById('createIBAN').value = '';
        document.getElementById('createValidacion').checked = false;
        document.getElementById('createSaldo').value = '';
        document.getElementById('createTipocuenta').value = '';

        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
        location.reload();
    })
    .catch(error => {
        console.error(error);
    });
}



document.getElementById('crearModal').style.display = 'none';

function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';

       

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