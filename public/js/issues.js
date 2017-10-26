/**
 * MODAL CODE
 */
// Get the modal
var modal = document.getElementById('pullrequest_modal');

// Get the button that opens the modal
var btn = document.getElementById("modalbutton");

// Get the <span> element that closes the modal
var span = document.getElementById("closepl");

// When the user clicks on the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
};

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
 * Validation functions
 */

/**
 * We check if the title is not empty
 */
function isTitleNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('issue-error-title').classList.add("show");
        return false;
    } else {
        document.getElementById('issue-error-title').classList.remove("show");
        return true;
    }
}

/**
 * Check if the description is not empty
 */
function isDescriptionNotEmpty(d) {
    if (d.length === 0) {
        document.getElementById('issue-error-desc').classList.add("show");
        return false;
    } else {
        document.getElementById('issue-error-desc').classList.remove("show");
        return true;
    }
}

/**
 * When the user clicks on the the button, it triggers this function that emit a socket to the server side in order to perform the insert
 */
document.getElementById('issue-submitbtn').addEventListener('click', function (e) {
    e.preventDefault();

    /**
     * We get the values in the form's inputs
     */
    var issueTitle = document.getElementById('issue-title').value,
        issueDescription = document.getElementById('issue-description').value;

    if (isTitleNotEmpty(issueTitle) && isDescriptionNotEmpty(issueDescription)) {
        socket.emit('newIssue', {
            issueTitle: issueTitle,
            issueDescription: issueDescription,
            projectId: getCurrentProjectId()
        });
        location.reload();
    }
});