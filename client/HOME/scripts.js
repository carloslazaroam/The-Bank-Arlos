window.addEventListener('DOMContentLoaded', () => {
    const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const id2 = localStorage.getItem('id2');

    const panelLink = document.querySelector('a[href="../PANEL/panel.html"]');

    // Ocultar el enlace inicialmente
    panelLink.style.display = 'none';

    async function checkUserAccounts() {
        const cuentas = await getUserAccounts();
        const cuentasActivas = cuentas.filter(cuenta => cuenta.activa);

        if (cuentasActivas.length > 0) {
            panelLink.style.display = 'block';
        } else {
            panelLink.style.display = 'none';
        }
    }

    // Obtener referencias a los elementos del DOM
    const btnTransaccion = document.querySelector('.btn-introduction');
    const modal = document.getElementById('modal');

    // Agregar evento click al botón de transacción
   // Agregar evento click al botón de transacción
btnTransaccion.addEventListener('click', async () => {
    const cuentas = await getUserAccounts();

    // Verificar si el usuario tiene al menos una cuenta activa
    const cuentasActivas = cuentas.filter(cuenta => cuenta.activa);

    if (cuentasActivas.length === 0) {
        // Si el usuario no tiene cuentas activas, mostrar el modal de alerta
        mostrarModal();
    } else {
        // Si el usuario tiene al menos una cuenta activa, redirigir al panel
        window.location.href = '../PANEL/panel.html';
    }
});


    async function getUserAccounts() {
        const url = `${recurso}/users/${id2}/accounts`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    // Función para mostrar el modal
    function mostrarModal() {
        modal.style.display = 'block';
    }

    checkUserAccounts();
});

function cancelarEdicion() {
    cuentaEditando = null;
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
