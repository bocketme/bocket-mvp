var socket = io('http://localhost:8080');

socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

function isNameNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('name-error').classList.add('show');
        return false;
    } else {
        document.getElementById('name-error').classList.remove('show');
        return true;
    }
}

function isFirstnameNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('firstname-error').classList.add('show');
        return false;
    } else {
        document.getElementById('firstname-error').classList.remove('show');
        return true;
    }
}

function isUsernameNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('username-error').classList.add('show');
        return false;
    } else {
        document.getElementById('username-error').classList.remove('show');
        return true;
    }
}

function isEmailNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('email-error').classList.add('show');
        return false;
    } else {
        document.getElementById('email-error').classList.remove('show');
        return true;
    }
}

function isCompanyNotEmpty(t) {
    if (t.length === 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * Form valation & sending to front
 */

document.getElementById('profile-button').addEventListener('click', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value,
        firstname = document.getElementById('firstname').value,
        username = document.getElementById('username').value,
        email = document.getElementById('email').value,
        company = document.getElementById('company').value;

    if (isNameNotEmpty(name) && isFirstnameNotEmpty(firstname) && isUsernameNotEmpty(username) && isEmailNotEmpty(email) && isCompanyNotEmpty(company)) {
        socket.emit('updateProfile', {
            name: name,
            firstname: firstname,
            username: username,
            email: email,
            company: company,
            userId: getUserId()
        });
        location.reload();
    } else {
        socket.emit('updateProfileNoCompany', {
            name: name,
            firstname: firstname,
            username: username,
            email: email,
            userId: getUserId()
        });
        location.reload();
    }
});