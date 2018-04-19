var isAnnotationMode = false;
var isHidden = true;
var HasClicked = false;
var savedAnnotation = {};
var allAnnotations = [];
var idx = 0;

$(document).ready(() => {
  /*
  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });
*/

  getAllAnnotations();

  function getAllAnnotations () {
    reinitCardFormContent();
    socket.emit('[Annotation] - fetch')
    socket.on('[Annotation] - fetch', (annotations, loadAnnotation) => {
      if (annotations !== null && annotations !== undefined) {
        allAnnotations = [];
        sortAnnotations(annotations, loadAnnotation)
      }
    });
  }

  $('#addNoteButton').on('click', () => {
    isAnnotationMode = !isAnnotationMode;
    if (isAnnotationMode === true) {
      Materialize.toast('Click to add a Note !', 3000, 'rounded blue');
      deselectAll();
      document.getElementById('addNoteButton').style.backgroundColor = '#00CCA0';
      document.getElementById('add-note-icon').innerHTML = 'clear';
      var evt = new Event("add-annotation");
      document.dispatchEvent(evt);
    } else {
      document.getElementById('cancel-note-button').click();
    }
  });

  $('#cancel-note-button').on('click', () => {
    reinitCardFormContent();
    document.getElementById('note-card-form').style.display = 'none';
    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    document.getElementById('add-note-icon').innerHTML = 'add';
    if (HasClicked === true) {
      // Call l'event Pour supprimer l'annotation coté viewer 
      var evt = new Event("del-last-annotation");
      document.dispatchEvent(evt);
    } else {
      var evt = new Event("close-annotation-mode");
      document.dispatchEvent(evt);
    }
    isAnnotationMode = false;
    HasClicked = false;
    savedAnnotation = undefined;
    deselectAll();
    // Ferme la note et ne l'ajoute pas dans la db
  });

  $('#post-note-button').on('click', () => {
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    const isImportant = document.getElementById('check-if-important').checked;

    savedAnnotation.title = title;
    savedAnnotation.content = content;
    savedAnnotation.isImportant = isImportant;
    document.getElementById('note-card-form').style.display = 'none';
    reinitCardFormContent();
    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    document.getElementById('add-note-icon').innerHTML = 'add';
    isAnnotationMode = false;
    HasClicked = false;
    socket.emit('[Annotation] - add', savedAnnotation);
    socket.on('[Annotation] - getTheLastAnnotation', (savedAnnotation) => {
      if (savedAnnotation !== null && savedAnnotation !== undefined) {
        if (!allAnnotations.find(function(element) {
          return savedAnnotation.name === element.name;
        })) {
          if (savedAnnotation.isImportant) {
            var evt = new CustomEvent("change-material", { 'detail': savedAnnotation });
            allAnnotations.unshift(savedAnnotation);
            addAnnotationCard(savedAnnotation);
            document.dispatchEvent(evt);
          } else {
            allAnnotations.push(savedAnnotation);
            addAnnotationCard(savedAnnotation);
          }
        }
      }
    });
  });

  $('#show-notes').on('click', () => {
    const displayValue = document.getElementById('side-info').style.getPropertyValue('display');
    document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
    isHidden = !isHidden;
    if (isHidden === true)
      $('#cancel-note-button').click();
    hideOrShowAnnotations();
    document.getElementById('side-details').style.display = 'none';
  });

  $('#show-info').on('click', () => {
    const displayValue = document.getElementById('side-details').style.getPropertyValue('display');
    document.getElementById('side-details').style.display = (displayValue === 'block' ? 'none' : 'block');
    document.getElementById('side-info').style.display = 'none';
    $('#cancel-note-button').click();
    isHidden = true;
    hideOrShowAnnotations();
  });

});

document.addEventListener('annotation3D-added', (e) => {
  if (e.detail !== null) {
    let annotation = e.detail;
    document.getElementById('note-card-form').style.display = 'block';
    HasClicked = true;
    savedAnnotation = annotation;
  } else {
    var evt = new Event("add-annotation");
    document.dispatchEvent(evt);
  }
}, false)

function sortAnnotations(annotations, loadAnnotation) {
  $('#note-list').empty();
  allAnnotations = annotations.slice();
  for (let i = 0; i < allAnnotations.length; i++) {
    allAnnotations[i].isSelected = false;
    addAnnotationCard(allAnnotations[i]);
    if (loadAnnotation)
      retrieve3dAnnotation(allAnnotations[i]);
  }
  hideOrShowAnnotations();
}

function retrieve3dAnnotation(annotation) {
  var evt = new CustomEvent("retrieve-annotation", { 'detail': annotation });
  document.dispatchEvent(evt);
}

function hideOrShowAnnotations () {
  if (isHidden === true) {
    var evt = new Event("hide-annotations");
    document.dispatchEvent(evt);
  } else {
    var evt = new Event("show-annotations");
    document.dispatchEvent(evt);
  }
}

function deselectAll() {
  for (annotation of allAnnotations) {
    annotation.isSelected = false;
    if (annotation.isImportant) {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #f44336';
      var evt = new CustomEvent("change-material", { 'detail': annotation });
      document.dispatchEvent(evt);
    } else {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
      var evt = new CustomEvent("change-material", { 'detail': annotation });
      document.dispatchEvent(evt);
    }
  }
}

function deselectAllExceptClicked(id) {
  for (annotation of allAnnotations) {
    if (annotation._id != id) {
      annotation.isSelected = false;
      if (annotation.isImportant) {
        document.getElementById(annotation.name).style.borderLeft = '6px solid #f44336';
        var evt = new CustomEvent("change-material", { 'detail': annotation });
        document.dispatchEvent(evt);
      } else {
        document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
        var evt = new CustomEvent("change-material", { 'detail': annotation });
        document.dispatchEvent(evt);
      }
    }
  }
}

function addAnnotationCard(annotation) {
  if (annotation !== undefined && annotation.isImportant) {
    $('#note-list').prepend('<li class="collection-item-note">\n' +
            '            <div id="' + annotation.name + '" class="note-important">\n' +
            '                <p class="note-title"><strong>' + annotation.title + '</strong><a id="' + annotation._id + '" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n' +
            '                <p class="note-content">' + annotation.content + '</p>\n' +
            '            </div>\n' +
            '        </li>');
  } else {
    $('#note-list').append('<li class="collection-item-note">\n' +
            '            <div id="' + annotation.name + '" class="note">\n' +
            '                <p class="note-title"><strong>' + annotation.title + '</strong><a id="' + annotation._id + '" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n' +
            '                <p class="note-content">' + annotation.content + '</p>\n' +
            '            </div>\n' +
            '        </li>');
  }
  $('#' + annotation._id).on('click', () => {
    socket.emit('[Annotation] - remove', annotation);
    socket.emit('[Annotation] - fetch', annotation);
    var evt = new CustomEvent("delete-annotation", { 'detail': annotation });
    document.dispatchEvent(evt);
  });
  $('#' + annotation.name).on('click', () => {
    deselectAllExceptClicked(annotation._id);
    annotation.isSelected = !annotation.isSelected;
    if (annotation.isSelected) {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #0DFFC8';
      var evt = new CustomEvent("select-annotation", { 'detail': annotation });
      document.dispatchEvent(evt);
    } else {
      if (annotation.isImportant) {
        document.getElementById(annotation.name).style.borderLeft = '6px solid #f44336';
        var evt = new CustomEvent("change-material", { 'detail': annotation });
        document.dispatchEvent(evt);
      } else {
        document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
        var evt = new CustomEvent("change-material", { 'detail': annotation });
        document.dispatchEvent(evt);
      }
    }
  });
}

function reinitCardFormContent() {
  document.getElementById('note-content-input').value = '';
  document.getElementById('note-title-input').value = '';
  document.getElementById('check-if-important').checked = false;
}
