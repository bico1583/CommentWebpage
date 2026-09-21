const USERS_STORAGE_KEY = "comments_users";
const COMMENTS_STORAGE_KEY = "comments";
const CURRENT_USER_STORAGE_KEY = "comments_current_user";


function getUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);

    if (!users) {
        return [];
    }

    return JSON.parse(users);
}


function saveUsers(users) {
    localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
    );
}


function getComments() {
    const comments = localStorage.getItem(COMMENTS_STORAGE_KEY);

    if (!comments) {
        return [];
    }

    return JSON.parse(comments);
}


function saveComments(comments) {
    localStorage.setItem(
        COMMENTS_STORAGE_KEY,
        JSON.stringify(comments)
    );
}


function getCurrentUser() {
    return sessionStorage.getItem(
        CURRENT_USER_STORAGE_KEY
    );
}


function setCurrentUser(username) {
    sessionStorage.setItem(
        CURRENT_USER_STORAGE_KEY,
        username
    );
}


function clearCurrentUser() {
    sessionStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );
}