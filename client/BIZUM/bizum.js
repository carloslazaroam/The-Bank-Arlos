const recurso = "http://127.0.0.1:3001";
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');
const id2 = localStorage.getItem('id2');


const llamar = () => {
    fetch(recurso + '/cuentas', {
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

function inicio(cuentas) {
    const wrapper = document.getElementById('wrapper');
    wrapper.innerHTML = "";
    
    cuentas.forEach(cuenta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cuenta.iban}</td>
            <td>${cuenta.id_usuario}</td>
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
        // Crear un objeto con los datos del usuario
        const operacionData = {
            nombre: nombre,
            cantidad: cantidad,
            concepto: concepto,
            ibanEmisor: ibanEmisor,
            ibanReceptor: ibanReceptor,
           
        };

        console.log(operacionData)

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
            document.getElementById('createEmisor').value = '';
            document.getElementById('createReceptor').value = '';

            console.log('Valores del formulario:');
    console.log('Nombre:', nombre);
    console.log('Cantidad:', cantidad);
    console.log('Concepto:', concepto);
    console.log('IBAN Emisor:', ibanEmisor);
    console.log('IBAN Receptor:', ibanReceptor);
   
            

            const crearModal = document.getElementById('crearModal');
            crearModal.style.display = 'none';

            location.reload()
        })
        .catch(error => {
            console.error(error);
        });
    } else {
        console.error('Algunos elementos del formulario no existen o están vacíos.');
    }
}


