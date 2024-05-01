
const banner = document.getElementById("banner")
const loginContainer = document.getElementById("login-container")
const signupContainer = document.getElementById("signup-container")
const loginToggle = document.getElementById("login-form-toggler")
const signupToggle = document.getElementById("signup-form-toggler")

signupToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(-100%)";
    loginContainer.style.transform = "scale(0)";
    signupContainer.style.transform = "scale(1)"
})
loginToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(0%)"
    signupContainer.style.transform = "scale(0)"
    loginContainer.style.transform = "scale(1)"
})



document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button');

    loginButton.addEventListener('click', async () => {
        const dni = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dni, contra: password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.id);
            console.log( data.usertype);
            alert('Inicio de sesión exitoso');
            if(data.usertype === '6632844e043b8bf3927f1aed'){
                window.location.href = '../USER/User-Admin/userAdmin.html';
                return
            }
            
            window.location.href = '../HOME/home.html';
        } else {
            alert(data.message);
        }
    });
});
