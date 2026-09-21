function initializeAuthentication() {
    renderAuthentication();

    document.addEventListener("click", function (event) {
        if (event.target.id === "register-button") {
            registerUser();
        }

        if (event.target.id === "login-button") {
            loginUser();
        }

        if (event.target.id === "logout-button") {
            logoutUser();
        }
    });
}


function renderAuthentication() {
    const authSection = document.getElementById("auth-section");
    const currentUser = getCurrentUser();

    if (currentUser) {
        authSection.innerHTML = `
            <span>Logged in as ${currentUser}</span>
            <button
                id="logout-button"
                class="logout-button"
                type="button"
            >
                Logout
            </button>
        `;

        return;
    }

    authSection.innerHTML = `
        <input
            id="username-input"
            type="text"
            placeholder="Username"
        >

        <input
            id="password-input"
            type="password"
            placeholder="Password"
        >

        <button
            id="login-button"
            type="button"
        >
            Login
        </button>

        <button
            id="register-button"
            type="button"
        >
            Register
        </button>

        <p id="auth-message"></p>
    `;
}


function registerUser() {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const message = document.getElementById("auth-message");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        message.textContent = "Username and password are required.";
        return;
    }

    const users = getUsers();

    const existingUser = users.find(function (user) {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    if (existingUser) {
        message.textContent = "Username already exists.";
        return;
    }

    users.push({
        username: username,
        password: password
    });

    saveUsers(users);
    setCurrentUser(username);

    renderAuthentication();
    renderCommentForm();
    renderComments();
}


function loginUser() {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const message = document.getElementById("auth-message");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        message.textContent = "Username and password are required.";
        return;
    }

    const users = getUsers();

    const user = users.find(function (storedUser) {
        return (
            storedUser.username.toLowerCase() === username.toLowerCase() &&
            storedUser.password === password
        );
    });

    if (!user) {
        message.textContent = "Invalid username or password.";
        return;
    }

    setCurrentUser(user.username);

    renderAuthentication();
    renderCommentForm();
    renderComments();
}


function logoutUser() {
    clearCurrentUser();

    renderAuthentication();
    renderCommentForm();
    renderComments();
}