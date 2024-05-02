window.addEventListener('DOMContentLoaded', () => {
    const recurso = "http://127.0.0.1:3001";

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    getUserData();

    async function getUserData() {
        const user = await getUserDB();
        // console.log(user);
        printUser(user)
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
        console.log(user);
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
                    `;

        const div = document.querySelector('.btn-container');
        div.innerHTML += `
     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="botonEditar"onclick="editarUser('${user.nombre}','${user.contra}', '${user.apellido1}', '${user.apellido2}', '${user.direccion}', '${user.pais}')">Editar</button>
    `

    }

    let userEditando = null;

    function editarUser(nombre, contra, apellido1, apellido2, direccion, pais, usertype) {
        // Almacenar los datos del usuario que se está editando
        userEditando = { nombre, apellido1, apellido2, direccion, pais, usertype };

        // Llenar el formulario de edición con los datos del usuario
        document.getElementById('editNombre').value = nombre;
        document.getElementById('editContra').value = contra;
        document.getElementById('editApellido1').value = apellido1;
        document.getElementById('editApellido2').value = apellido2;
        document.getElementById('editDireccion').value = direccion;
        document.getElementById('editPais').value = pais; ç

    }
});