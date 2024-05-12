window.addEventListener('DOMContentLoaded', () => {

    const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');


    document.getElementById('line-chart-container').style.display = 'none';
    document.querySelector('.graficos2').style.display = 'none';
    document.getElementById('monthly-evolution-chart-container').style.display = 'none';
    
    

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
        // Dentro de la función printAccounts

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
            // Dentro de la función printAccounts
            
           


        });
    }

   
    

   


    function generateLineChart(operaciones) {
        let balanceAcumulado = 0;
        const datos = [];
        const etiquetas = [];
        
        operaciones.forEach(op => {
            if (op.tipo === 'ingreso') {
                balanceAcumulado += parseFloat(op.cantidad);
            } else if (op.tipo === 'retiro') {
                balanceAcumulado -= parseFloat(op.cantidad);
            }
            datos.push(balanceAcumulado);
            etiquetas.push(op.nombre);
        });
    
        const existingChart = Chart.getChart('line-chart'); // Obtener la instancia del gráfico existente
        if (existingChart) {
            existingChart.destroy(); // Destruir el gráfico existente si hay uno
        }
    
        const ctx = document.getElementById('line-chart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Balance acumulado',
                    data: datos,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    // Agrega un contenedor en tu HTML para el gráfico de pastel con el id 'pie-chart'
// Ejemplo: <canvas id="pie-chart"></canvas>

function generatePieChart(ingresos, retiradas) {
    const existingChart = Chart.getChart('pie-chart'); // Obtener la instancia del gráfico existente
    if (existingChart) {
        existingChart.destroy(); // Destruir el gráfico existente si hay uno
    }

    const ctx = document.getElementById('pie-chart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ingresos', 'Retiradas'],
            datasets: [{
                label: 'Distribución de fondos',
                data: [ingresos, retiradas],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // Color para ingresos
                    'rgba(255, 99, 132, 0.2)'   // Color para retiradas (rojo)
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


function generateBarChart(totalIngresos, totalRetiradas, saldoActual) {
    const existingChart = Chart.getChart('bar-chart'); // Obtener la instancia del gráfico existente
    if (existingChart) {
        existingChart.destroy(); // Destruir el gráfico existente si hay uno
    }

    const ctx = document.getElementById('bar-chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Retiradas', 'Saldo Actual'],
            datasets: [{
                label: 'Balance de cuenta',
                data: [totalIngresos, totalRetiradas, saldoActual],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)', // Color para ingresos (azul)
                    'rgba(255, 99, 132, 0.2)', // Color para retiradas (rojo)
                    'rgba(75, 192, 192, 0.2)'  // Color para saldo actual (verde)
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para generar el gráfico de evolución mensual
function generateMonthlyEvolutionChart(data) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ingresos = new Array(12).fill(0); // Array para almacenar los ingresos por mes, inicializado con ceros
    const retiradas = new Array(12).fill(0); // Array para almacenar las retiradas por mes, inicializado con ceros

    // Calcular los ingresos y las retiradas por mes
    data.forEach(op => {
        const date = new Date(op.fecha);
        const monthIndex = date.getMonth(); // Obtener el índice del mes
        if (op.tipo === 'ingreso') {
            ingresos[monthIndex] += parseFloat(op.cantidad); // Sumar el ingreso al mes correspondiente
        } else if (op.tipo === 'retiro') {
            retiradas[monthIndex] += parseFloat(op.cantidad); // Sumar la retirada al mes correspondiente
        }
    });

    // Obtener el lienzo del gráfico existente
    const ctx = document.getElementById('monthly-evolution-chart').getContext('2d');

    // Destruir el gráfico existente si hay alguno
    if (window.monthlyEvolutionChart) {
        window.monthlyEvolutionChart.destroy();
    }

    // Crear el gráfico de evolución mensual
    window.monthlyEvolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months, // Etiquetas de los meses
            datasets: [{
                label: 'Ingresos',
                data: ingresos,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false
            }, {
                label: 'Retiradas',
                data: retiradas,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}




async function getAccountDetails(iban) {
    try {
        const response = await fetch(`${recurso}/cuentas/${iban}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los detalles de la cuenta: ${response.status}`);
        }
        const cuentas = await response.json();
        if (cuentas.length > 0) {
            const cuenta = cuentas[0];
            const operaciones = await getOperationsByAccountId(cuenta._id);
            
            let totalIngresos = 0;
            let totalRetiradas = 0;
            operaciones.forEach(op => {
                if (op.tipo === 'ingreso') {
                    totalIngresos += parseFloat(op.cantidad);
                } else if (op.tipo === 'retiro') {
                    totalRetiradas += parseFloat(op.cantidad);
                }
            });
            
            updateBalance(cuenta.saldo);
            displayOperations(operaciones);
            document.getElementById('line-chart-container').style.display = 'block';
            document.querySelector('.graficos2').style.display = 'flex';
            document.getElementById('monthly-evolution-chart-container').style.display = 'block';
            generateLineChart(operaciones);
            generatePieChart(totalIngresos, totalRetiradas);
            generateMonthlyEvolutionChart(operaciones);
           
            
            // Generar el gráfico de barras con los datos de ingresos, retiradas y saldo
            generateBarChart(totalIngresos, totalRetiradas, cuenta.saldo);
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

    async function displayOperations(operaciones) {
        const cajitasList = document.querySelector('.cajitas');
        cajitasList.innerHTML = ""; // Limpiar la lista antes de añadir nuevas operaciones
    
        operaciones.forEach(async operacion => {
            // Determinar el símbolo correspondiente basado en el tipo de operación
            const transactionSymbol = operacion.tipo === 'ingreso' ? '+' : '-';
            const transactionClass = operacion.tipo === 'ingreso' ? 'funds-plus' : 'funds-minus';
            cajitasList.innerHTML += `
            <li class="transaction ${transactionClass}">
                    <div class="transaction-details cf">
                        <div class="left">
                            <div class="transaction-symbol">${transactionSymbol}</div>
                        </div>
    
                        <div class="right">
                            <div class="transaction-name">${operacion.nombre}</div>
                            <div class="transaction-meta">${operacion.concepto}</div>
                        </div>
                    </div>
    
                    <div class="transaction-balance">${operacion.cantidad}<span class="small-numbers">€</span></div>
                </li>
            `;
        });
    }
    
    
    
    
    function updateBalance(newBalance) {
        const balanceValue = document.querySelector('.balance-value');
        balanceValue.textContent = `${newBalance.toFixed(2)}€`;
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

function mostrarFormulario2() {
    const crearModal = document.getElementById('crearModal2');
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
        const select = document.getElementById('createCuenta2');
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

// Función para mostrar el modal de confirmación
function mostrarModalConfirmacion() {
    // Obtener el modal de confirmación por su ID
    const modalConfirmacion = document.getElementById('modalConfirmacion');
    // Mostrar el modal de confirmación
    modalConfirmacion.style.display = 'block';
}

// Función para mostrar el modal de eliminación
function mostrarModalEliminacion() {
    // Obtener el modal de eliminación por su ID
    const modalEliminacion = document.getElementById('modalEliminación');
    // Mostrar el modal de eliminación
    modalEliminacion.style.display = 'block';
}

// Función para cerrar el modal de creación de users
function cancelarCreacion() {
    const crearModal = document.getElementById('crearModal');
    crearModal.style.display = 'none';
}

function cancelarCreacion2() {
    const crearModal = document.getElementById('crearModal2');
    crearModal.style.display = 'none';
}

function cerrarModalEliminacion() {
    const modalEliminacion = document.getElementById('modalEliminación');
    modalEliminacion.style.display = 'none';

    // Cerrar el otro modal si está abierto
    cerrarModalCreacion();
}

// Función para enviar la solicitud de creación de un nuevo ingreso al servidor
function guardarNuevoIngreso() {
    const nombre = document.getElementById('createNombre').value;
    const cantidad = document.getElementById('createCantidad').value;
    const concepto = document.getElementById('createConcepto').value;
    const id_cuenta = document.getElementById('createCuenta').value;
    const tipo = document.getElementById('tipo').value;

    // Crear un objeto con los datos del usuario
    const operacionData = {
        nombre: nombre,
        cantidad: cantidad,
        concepto: concepto,
        id_cuenta: id_cuenta,
        tipo: tipo
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
        // Mostrar el modal de confirmación
        mostrarModalConfirmacion();
        // Limpiar el formulario después de añadir el operación
        document.getElementById('createNombre').value = '';
        document.getElementById('createCantidad').value = '';
        document.getElementById('createConcepto').value = '';
        document.getElementById('createCuenta').value = '';
        document.getElementById('tipo').value = '';
        const crearModal = document.getElementById('crearModal');
        crearModal.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
        // Mostrar el modal de eliminación en caso de error
        mostrarModalEliminacion();
    });
}

// Función para enviar la solicitud de creación de una nueva retirada al servidor
function guardarNuevaRetirada() {
    const nombre = document.getElementById('createNombre2').value;
    const cantidad = document.getElementById('createCantidad2').value;
    const concepto = document.getElementById('createConcepto2').value;
    const id_cuenta = document.getElementById('createCuenta2').value;
    const tipo = document.getElementById('tipo').value;

    // Crear un objeto con los datos del usuario
    const operacionData = {
        nombre: nombre,
        cantidad: cantidad,
        concepto: concepto,
        id_cuenta: id_cuenta,
        tipo: tipo
    };

    // Enviar la solicitud POST al servidor
    fetch(recurso + '/operacion/retirar', {
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
        // Mostrar el modal de confirmación
        mostrarModalConfirmacion();
        // Limpiar el formulario después de añadir el operación
        document.getElementById('createNombre2').value = '';
        document.getElementById('createCantidad2').value = '';
        document.getElementById('createConcepto2').value = '';
        document.getElementById('createCuenta2').value = '';
        document.getElementById('tipo').value = '';
        const crearModal = document.getElementById('crearModal2');
        crearModal.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
        // Mostrar el modal de eliminación en caso de error
        mostrarModalEliminacion();
    });
}

document.getElementById('crearModal2').style.display = 'none';








