window.addEventListener('DOMContentLoaded', () => {
    const recurso = "http://127.0.0.1:3001";
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    getUserData();

    async function getUserData() {
        const user = await getUserDB();
        printUser(user);
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
                <td>Nombre</td>
                <td>${user.nombre}</td>
            </tr>
            <tr>
                <td>Primer apellido</td>
                <td>${user.apellido1}</td>
            </tr>
            <tr>
                <td>Segundo Apellido</td>
                <td>${user.apellido2}</td>
            </tr>
            <tr>
                <td>Dirección</td>
                <td>${user.direccion}</td>
            </tr>
            <tr>
                <td>Pais</td>
                <td>${user.pais}</td>
            </tr>
            <button type="button" class="btn btn-secondary" onclick="editarUser('${user.id}','${user.nombre}','${user.contra}', '${user.apellido1}', '${user.apellido2}', '${user.direccion}', '${user.pais}')" style="margin-top:10px">Editar user</button>
            
        `;
        
    }
   
});
    // Función para abrir el modal de confirmación de eliminación
    function confirmarEliminacion(nombre) {
        // Mostrar el modal de confirmación
        const confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'block';
        
        // Configurar el botón de confirmar para enviar la solicitud DELETE
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.onclick = function() {
            eliminarUser(nombre);
            confirmModal.style.display = 'none'; // Ocultar el modal después de confirmar
        };
    }
    
    
    
    
    // Agrega una variable global para almacenar el título del user que se está editando
    
    
    // Función para abrir el modal de edición con los datos del user seleccionado
    // Función para let userEditando = null;abrir el modal de edición con los datos del user seleccionado
    // Función para abrir el modal de edición con los datos del usuario seleccionado
    function editarUser(id,nombre,contra, apellido1, apellido2, direccion, pais) {
        // Almacenar los datos del usuario que se está editando
        userEditando = { id,nombre, apellido1, apellido2, direccion, pais };
        
        // Llenar el formulario de edición con los datos del usuario
        document.getElementById('editNombre').value = nombre;
        document.getElementById('editContra').value = contra;
        document.getElementById('editApellido1').value = apellido1;
        document.getElementById('editApellido2').value = apellido2;
        document.getElementById('editDireccion').value = direccion;
        document.getElementById('editPais').value = pais; // Corregido de 'editPais' a 'editDireccion'
    
        
        
        // Mostrar el modal de edición
        const modal = document.getElementById('modal');
        modal.style.display = 'block'; // Asegúrate de que el modal se muestre
        console.log('Modal de edición abierto'); // Agrega un mensaje de consola para verificar si el modal se abre correctamente
    }
    
    // Función para enviar la solicitud de actualización al servidor
function guardarEdicion() {
    // Obtener los nuevos datos del usuario desde el formulario
    const newNombre = document.getElementById('editNombre').value;
    const newContra = document.getElementById('editContra').value;
    const newApellido1 = document.getElementById('editApellido1').value;
    const newApellido2 = document.getElementById('editApellido2').value;
    const newDireccion = document.getElementById('editDireccion').value;
    const newPais = document.getElementById('editPais').value;

    // Enviar la solicitud de actualización al servidor
    fetch("http://127.0.0.1:3001" + '/users/' + userEditando.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: newNombre,
            contra: newContra,
            apellido1: newApellido1,
            apellido2: newApellido2,
            direccion: newDireccion,
            pais: newPais.pais
            // Conservamos el valor original del país
        })
    })
    .then(res => {
        if (res.ok) {
            // Cerrar el modal después de la actualización exitosa
            document.getElementById('modal').style.display = 'none';
            // Recargar la página después de una actualización exitosa
            location.reload();
            // Volver a cargar la lista de usuarios después de actualizar uno
        } else {
            console.error('Error al actualizar el usuario');
        }
    })
    .catch(err => console.error('Error al actualizar el usuario:', err));
}

    
    
    // Función para cerrar el modal de edición
    function cancelarEdicion() {
        // Limpiar los datos del user en edición
        userEditando = null;
        
        // Ocultar el modal con animación de opacidad
        const modal = document.getElementById('modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1'; // Restablecer la opacidad para futuras aperturas
        }, 500); // El mismo tiempo que la duración de la animación
    }
    function cancelarEliminacion() {
        const confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'none';
    }
    