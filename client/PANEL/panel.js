window.addEventListener('DOMContentLoaded', () => {
    const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');

    

    getUserData();
    

    getUserData();
    async function getUserData() {
        const cuentas = await getUserAccounts(); // Obtener cuentas del usuario
        printAccounts(cuentas);
        
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


    function printAccounts(accountsData) {
        const cards = document.getElementById('cards');
        cards.innerHTML = ""; // Limpiar el contenedor antes de imprimir las cuentas
    
        accountsData.forEach(account => {
            let cardType = ""; // Variable para almacenar el tipo de tarjeta
            switch(account.empresa) {
                case "visa":
                    cardType = "card-visa";
                    break;
                case "mastercard":
                    cardType = "card-mastercard";
                    break;
                case "amex":
                    cardType = "card-amex";
                    break;
                default:
                    cardType = ""; // Si no hay coincidencia, no se establece ninguna clase
            }
    
            const cardElement = document.createElement('li');
            cardElement.classList.add("card", cardType, "active");
            cardElement.innerHTML = `
                <div class="card-emblem"></div>
                <div class="card-number">${account.iban}</div>
                <div class="card-valid">${formatDate(account.fechacreacion)}</div>
            `;
            // Agrega un evento clic para obtener detalles de la cuenta
            cardElement.addEventListener('click', () => {
                getAccountDetails(account.iban); // Llama a la función para obtener detalles de la cuenta
            });
            cards.appendChild(cardElement);
        });
    }


    async function getAccountDetails(iban) {
        try {
            const response = await fetch(`${recurso}/cuentas/${iban}`);
            if (!response.ok) {
                throw new Error(`Error al obtener los detalles de la cuenta: ${response.status}`);
            }
            const cuentas = await response.json(); // Convertimos la respuesta a un array de cuentas
            if (cuentas.length > 0) {
                const cuenta = cuentas[0]; // Obtenemos el primer elemento del array
                console.log("ID de la cuenta:", cuenta._id); // Imprimir el ID de la cuenta
                // Ahora podemos hacer una solicitud para obtener las operaciones asociadas a esta cuenta
                const operaciones = await getOperationsByAccountId(cuenta._id);
                console.log("Operaciones asociadas a la cuenta:", operaciones);
                // Actualizar el saldo en el HTML
                updateBalance(cuenta.saldo);
                // Resto del código para mostrar detalles de la cuenta en el frontend
                displayOperations(operaciones);
            } else {
                console.error("Error: No se encontraron cuentas con el IBAN especificado.");
            }
        } catch (error) {
            console.error("Error al obtener detalles de la cuenta:", error);
        }
    }
    
    
    async function getOperationsByAccountId(accountId) {
        try {
            const response = await fetch(`${recurso}/operaciones/cuenta/${accountId}`);
            if (!response.ok) {
                throw new Error(`Error al obtener las operaciones asociadas a la cuenta: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error al obtener las operaciones asociadas a la cuenta:", error);
            return []; // Devolvemos un array vacío en caso de error
        }
    }

    function displayOperations(operaciones) {
        const cajitasList = document.querySelector('.cajitas');
        cajitasList.innerHTML = ""; // Limpiar la lista antes de añadir nuevas operaciones
    
        operaciones.forEach(operacion => {
            cajitasList.innerHTML += `

            <li class="transaction funds-minus">
                            <div class="transaction-details cf">
                                <div class="left">
                                    <div class="transaction-symbol">-</div>
                                </div>
    
                                <div class="right">
                                    <div class="transaction-name">${operacion.nombre}</div>
                                    <div class="transaction-meta">${operacion.cantidad}</div>
                                </div>
                            </div>
    
                            <div class="transaction-balance"><span class="small-numbers">00</span></div>
                        </li>
                
            `;
        });
    }
    
    
    function updateBalance(newBalance) {
        const balanceValue = document.querySelector('.balance-value');
        balanceValue.textContent = `£${newBalance.toFixed(2)}`;
    }
    

    

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

   

   
});


const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');


    // Función para mostrar el modal de creación de users
function mostrarFormulario() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'block';

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
        const select = document.getElementById('createCuenta');
        select.innerHTML = ""; // Limpiar las opciones existentes
        cuentas.forEach(cuenta => {
            const option = document.createElement('option');
            option.value = cuenta._id;
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

// Función para enviar la solicitud de creación de un nuevo operacion al servidor

function guardarNuevaOperacion() {
    const nombre = document.getElementById('createNombre').value;
    const cantidad = document.getElementById('createCantidad').value;
    const concepto = document.getElementById('createConcepto').value;
    const id_cuenta = document.getElementById('createCuenta').value;
    
    
    
    // Crear un objeto con los datos del usuario
    const operacionData = {
        nombre: nombre,
        cantidad: cantidad,
        concepto: concepto,
        id_cuenta: id_cuenta,
       
        
    };

    // Enviar la solicitud POST al servidor
    fetch(recurso + '/operacion/ingresar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(operacionData) // Convertir el objeto a JSON antes de enviarlo
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir la operación: ' + response.status + ' ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Nueva operación añadida:', data);
        // Actualizar la interfaz con el nuevo operacion
       
        
        // Limpiar el formulario después de añadir el operacion
        document.getElementById('createNombre').value = '';
        document.getElementById('createCantidad').value = '';
        document.getElementById('createConcepto').value = '';
        document.getElementById('createCuenta').value = '';
        
        
        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
    });
}


document.getElementById('crearModal').style.display = 'none';












