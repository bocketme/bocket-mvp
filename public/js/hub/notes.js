var isAnnotationMode = false;
var isHidden = false;
var HasClicked = false;
var savedAnnotation = undefined;
var allAnnotations = [];

$(document).ready(() => {
  /*
  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });
*/

  getAllAnnotations();

  function getAllAnnotations() {
    console.log('Je get les annotations');
    socket.emit('[Annotation] - fetch')
    socket.on('[Annotation] - fetch', (annotations) => {
      if (annotations !== null && annotations !== undefined) {
        allAnnotations = [];
        sortAnnotations(annotations)
      }
    })
  }

  $('#addNoteButton').on('click', () => {
    isAnnotationMode = (isAnnotationMode === true ? false : true);
    if (isAnnotationMode === true) {
      document.getElementById('addNoteButton').style.backgroundColor = 'red';
      document.getElementById('add-note-icon').innerHTML = 'clear';
      var evt = new Event("add-annotation");
      document.dispatchEvent(evt);
    } else {
      document.getElementById('cancel-note-button').click();
    }
    // document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#hideNoteButton').on('click', () => {

    // document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#cancel-note-button').on('click', () => {
    console.log('Node canceled');
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('check-if-important').checked = false;
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
    // Ferme la note et ne l'ajoute pas dans la db
  });

  $('#post-note-button').on('click', () => {
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    const isImportant = document.getElementById('check-if-important').checked;

    savedAnnotation.title = title;
    savedAnnotation.content = content;
    savedAnnotation.isImportant = isImportant;
    console.log(savedAnnotation.title);
    console.log(savedAnnotation.content);
    console.log(savedAnnotation.isImportant);
    document.getElementById('note-card-form').style.display = 'none';
/*     if (isImportant) {
      $('#note-list').prepend(`${'<li class="collection-item-note">\n' +
          '            <div class="note-important">\n' +
          '                <p class="note-title"><strong>'}${savedAnnotation.title}</strong><a id="${savedAnnotation.title}" href=# style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
          `                <p class="note-content">${savedAnnotation.content}</p>\n` +
          '            </div>\n' +
          '        </li>');
    } else {
      $('#note-list').append(`${'<li class="collection-item-note">\n' +
            '            <div class="note">\n' +
            '                <p class="note-title"><strong>'}${savedAnnotation.title}</strong><a id="${savedAnnotation.title}" href=# style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
            `                <p class="note-content">${savedAnnotation.content}</p>\n` +
            '            </div>\n' +
            '        </li>');
    }
    $('#' + savedAnnotation.title).on('click', () => {
      console.log(savedAnnotation.title);
      var evt = new CustomEvent("delete-annotation", { 'detail' : savedAnnotation });
      document.dispatchEvent(evt);
    }); */
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('check-if-important').checked = false;
    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    document.getElementById('add-note-icon').innerHTML = 'add';
    isAnnotationMode = false;
    HasClicked = false;
    socket.emit('[Annotation] - add', savedAnnotation);
    socket.emit('[Annotation] - fetch', savedAnnotation);
  });

  $('#show-notes').on('click', () => {
    const displayValue = document.getElementById('side-info').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
    console.log('show-notes');
    isHidden = (isHidden === true ? false : true);
    if (isHidden === true) {

    } else {
      var evt = new Event("show-annotations");
      document.dispatchEvent(evt);
    }
  });
});

function clickedList()  {
  console.log('JAI CLIQUE');
}


document.addEventListener('annotation3D-added', (e) => {
  if (e.detail !== null) {
    let annotation = e.detail;
    console.log("JAI RECU LEVENT d'ajout d'annotation : " + e.detail.name);
    document.getElementById('note-card-form').style.display = 'block';
    HasClicked = true;
    savedAnnotation = annotation;
  } else {
    var evt = new Event("add-annotation");
    document.dispatchEvent(evt);
    console.log('e.detail == null');
  }
}, false)

function sortAnnotations(annotations) {
  $('#note-list').empty();
  annotations.sort(function(a, b) {
    if (a.isImportant && b.isImportant === false) { return -1; }
    if (b.isImportant && a.isImportant === false ){ return 1; }
    return 0;
  });
  allAnnotations = annotations.slice();
  for (let i = 0; i < allAnnotations.length; i++) {
    if (allAnnotations[i] !== undefined && allAnnotations[i].isImportant) {
      $('#note-list').append(`${'<li class="collection-item-note">\n' +
      '            <div class="note-important">\n' +
      '                <p class="note-title"><strong>'}${allAnnotations[i].title}</strong><a id="${allAnnotations[i]._id}" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
      `                <p class="note-content">${allAnnotations[i].content}</p>\n` +
      '            </div>\n' +
      '        </li>');
    } else {
      $('#note-list').append(`${'<li class="collection-item-note">\n' +
      '            <div class="note">\n' +
      '                <p class="note-title"><strong>'}${allAnnotations[i].title}</strong><a id="${allAnnotations[i]._id}" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
      `                <p class="note-content">${allAnnotations[i].content}</p>\n` +
      '            </div>\n' +
      '        </li>');
    }
    $('#' + allAnnotations[i]._id).on('click', () => {
      console.log(allAnnotations[i]._id);
      socket.emit('[Annotation] - remove', allAnnotations[i]);
      socket.emit('[Annotation] - fetch', allAnnotations[i]);
      var evt = new CustomEvent("delete-annotation", { 'detail' : allAnnotations[i] });
      document.dispatchEvent(evt);
    });
  }
}
