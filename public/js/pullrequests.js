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
 * 
 */
function branchesIsValid(d, s) {
    if (d === s) {
        document.getElementById('branch-pl-error').classList.add("show");
        return false;
    } else {
        document.getElementById('branch-pl-error').classList.remove("show");
        return true;
    }
}

function isTitleNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('title-error').classList.add("show");
        return false;
    } else {
        document.getElementById('title-error').classList.remove("show");
        return true;
    }
}

function isDescriptionNotEmpty(d) {
    if (d.length === 0) {
        document.getElementById('description-error').classList.add("show");
        return false;
    } else {
        document.getElementById('description-error').classList.remove("show");
        return true;
    }
}

document.getElementById('pl-submitbtn').addEventListener('click', function (e) {
    e.preventDefault();

    var destinationBranch = document.getElementById('destination-branch'),
        sourceBranch = document.getElementById('source-branch'),
        prTitle = document.getElementById('pullrequest-title').value,
        prDescription = document.getElementById('pullrequest-description').value;

    var destBranchId = destinationBranch.options[destinationBranch.selectedIndex].value;
    var sourceBranchId = sourceBranch.options[sourceBranch.selectedIndex].value;

    if (branchesIsValid(destBranchId, sourceBranchId) && isTitleNotEmpty(prTitle) && isDescriptionNotEmpty(prDescription)) {
        socket.emit('newPullRequest', {
            destinationBranch: destBranchId,
            sourceBranch: sourceBranchId,
            prTitle: prTitle,
            prDescription: prDescription,
            projectId: getCurrentProjectId()
        });
        location.reload();
    }
});