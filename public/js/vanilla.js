/**
 * DROPDOWN FUNCTIONS
 */

function showdropdownTeam() {
    closeAllDropDown();
    document.getElementById("dropdownTeam").classList.toggle("show");
}

function showdropdownBranch() {
    closeAllDropDown();
    document.getElementById("dropdownBranch").classList.toggle("show");
}

function showdropdownMore() {
    closeAllDropDown();
    document.getElementById("dropdownMore").classList.toggle("show");
}

function showdropdownNotif() {
    closeAllDropDown();
    document.getElementById("dropdownNotif").classList.toggle("show");
}

function showdropdownNew() {
    closeAllDropDown();
    document.getElementById("dropdownNew").classList.toggle("show");
}

function showdropdownUser() {
    closeAllDropDown();
    document.getElementById('dropdownUser').classList.toggle("show");
}

function closeAllDropDown() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}

// Close the dropdown menu if the user clicks outside of it
document.onclick = function (event) {
    if (!event.target.matches('.dropbtn'))
        closeAllDropDown();
};


/**
 * Function for getting the project id in the URL
 */
var getCurrentProjectId = function () {
    var location = window.location.pathname;

    if (location.indexOf("pullrequests") !== -1) {
        location = location.replace("/pullrequests/", "");
    } else if (location.indexOf("issues") !== -1) {
        location = location.replace("/issues/", "");
    } else if (location.indexOf("files") !== -1) {
        location = location.replace("/files/", "");
    } else if (location.indexOf("new-node") !== -1) {
        location = location.replace("/new-node/", "");
    }
    return parseInt(location);
};

var getCommentId = function () {
    var location = window.location.pathname;
    var commentId = null;

    if ((location.indexOf("pullrequests") !== -1) || (location.indexOf("issues") !== -1) || (location.indexOf("dashboard" !== -1)) || (location.indexOf("nomenclature" !== -1)) || (location.indexOf("dashboard" !== -1))) {
        var index = location.lastIndexOf('/');
        commentId = location.substring(index + 1);
    }
    return parseInt(commentId);
};

var getUserId = function () {
    var location = window.location.pathname;
    var userId = null;

    if (location.indexOf("profile")) {
        var index = location.lastIndexOf('/');
        userId = location.substring(index + 1);
    }
    return parseInt(userId);
};

/**
 * Toggle sidebar info
 */

document.getElementById('sidebar-button').addEventListener('click', function (e) {
    e.preventDefault();

    var sidebar = document.getElementById('sidebar-info');

    if (sidebar.classList.contains("visible")) {
        sidebar.classList.remove('visible');
        document.getElementById("main").style.marginRight = "0";
    } else {
        sidebar.classList.add('visible');
        document.getElementById("main").style.marginRight = "350px";
    }
});

/**
 * Modal for creating a node
 */

// Get the modal
var modal = document.getElementById('node-modal');

// Get the button that opens the modal
var btn = document.getElementById("modalbutton");

// Get the <span> element that closes the modal
var span = document.getElementById("closepl");

// When the user clicks on the button, open the modal 
document.getElementById("modalbutton").addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var socket = io('http://localhost:8080');

socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

/**
 * INFO BULLES
 */