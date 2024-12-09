export function loginUser(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    return fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid username or password');
        }
        return response.json();
    })
    .then(data => {
        console.log('Access token:', data.access_token);
        // Сохраняем токен и user_id
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}
const loginFormElement = document.getElementById('loginForm');
loginFormElement.addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем отправку формы

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        loginUser(username, password)
        .then(data => {
            console.log('Login successful:', data);
            alert('Login successful');
            window.location.href = "/main"; // Переход на главную страницу
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка: Неправильный логин или пароль.');
        });
    } else {
        alert("Пожалуйста, заполните оба поля.");
    }
});
