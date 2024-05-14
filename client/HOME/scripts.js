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
        if (cuentas.length > 0) {
            panelLink.style.display = 'block';
        } else {
            panelLink.style.display = 'none';
        }
    }

  // Obtener referencias a los elementos del DOM
  const btnTransaccion = document.querySelector('.btn-introduction');
  const modal = document.getElementById('modal');

  // Agregar evento click al botón de transacción
  btnTransaccion.addEventListener('click', async () => {
      const cuentas = await getUserAccounts();

      // Si el usuario no tiene cuentas, mostrar el modal
      if (cuentas.length === 0) {
          mostrarModal();
      } else {
          // Si el usuario tiene al menos una cuenta, redirigir al HTML deseado
          window.location.href = '../PANEL/panel.html'; // Reemplaza 'tu_archivo.html' con la ruta a tu HTML
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


