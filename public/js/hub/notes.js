let isAnnotationMode = false;
let isHidden = true;
let HasClicked = false;
let savedAnnotation = {};
let allAnnotations = [];
const idx = 0;

$(document).ready(() => {
  /*
  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });
*/


  $('#show-notes').on({
    mouseenter: function() {
      $('#show-notes img').attr('src', '/img/pin-hover.svg');
    },
    mouseleave: function () {
      if (isHidden === true) {
        $('#show-notes img').attr('src', '/img/pin-normal.svg');
      } else {
        $('#show-notes img').attr('src', '/img/pin-selected.svg');
      }
    },
    click: function () {
      const displayValue = document.getElementById('side-info').style.getPropertyValue('display');
      document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
      isHidden = !isHidden;
      if (isHidden === true)
        $('#cancel-note-button').click();
      hideOrShowAnnotations();
      document.getElementById('side-details').style.display = 'none';
    }
  },'img');

  $('#show-info').on({
    mouseenter: function () {
      $('#show-info img').attr('src', '/img/details-hover.svg');
    },
    mouseleave: function () {
      const displayValue = document.getElementById('side-details').style.getPropertyValue('display');
      if (displayValue === 'none') {
        $('#show-info img').attr('src', '/img/details-normal.svg');
      } else if (displayValue === 'block') {
        $('#show-info img').attr('src', '/img/details-selected.svg');
      }
    },
    click: function () {
      const displayValue = document.getElementById('side-details').style.getPropertyValue('display');
      document.getElementById('side-details').style.display = (displayValue === 'block' ? 'none' : 'block');
      document.getElementById('side-info').style.display = 'none';
      $('#cancel-note-button').click();
      isHidden = true;
      hideOrShowAnnotations();
    }
  },'img');

  socket.on('[Annotation] - confirmAnnotation', (gettedAnnotation) => {
    if (gettedAnnotation !== null && gettedAnnotation !== undefined) {
      if (!allAnnotations.find((element) => gettedAnnotation.name === element.name)) {
        savedAnnotation = gettedAnnotation;
        if (savedAnnotation.isImportant) {
          const evt = new CustomEvent('change-material', { detail: savedAnnotation });
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

  socket.on('[Annotation] - fetchNewAnnotation', newAnnotation => {
    if (newAnnotation) {
      (newAnnotation.isImportant ? allAnnotations.unshift(newAnnotation) : allAnnotations.push(newAnnotation));
      addAnnotationCard(newAnnotation);
      retrieve3dAnnotation(newAnnotation);
    }
  });

  getAllAnnotations();

  function getAllAnnotations() {
    reinitCardFormContent();
    socket.emit('[Annotation] - fetch');
    socket.on('[Annotation] - fetch', (annotations, loadAnnotation) => {
      if (annotations !== null && annotations !== undefined) {
        allAnnotations = [];
        sortAnnotations(annotations, loadAnnotation);
      }
    });
  }

  $('#addNoteButton').on('click', () => {
    isAnnotationMode = !isAnnotationMode;
    if (isAnnotationMode === true) {
      Materialize.toast('Click to add a Note !', 3000, 'rounded blue');
      deselectAll();
      document.getElementById('addNoteButton').classList.add('active');
      document.getElementById('add-note-icon').innerHTML = 'clear';
      const evt = new Event('add-annotation');
      document.dispatchEvent(evt);
    } else {
      document.getElementById('cancel-note-button').click();
    }
  });

  $('#cancel-note-button').on('click', () => {
    reinitCardFormContent();
    document.getElementById('note-card-form').style.display = 'none';
    document.getElementById('addNoteButton').classList.remove('active');
    document.getElementById('add-note-icon').innerHTML = 'add';
    if (HasClicked === true) {
      // Call l'event Pour supprimer l'annotation coté viewer
      var evt = new Event('del-last-annotation');
      document.dispatchEvent(evt);
    } else {
      var evt = new Event('close-annotation-mode');
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
    document.getElementById('addNoteButton').classList.remove('active');
//    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    document.getElementById('add-note-icon').innerHTML = 'add';
    isAnnotationMode = false;
    HasClicked = false;
    socket.emit('[Annotation] - add', savedAnnotation);
  });

});

document.addEventListener('annotation3D-added', (e) => {
  if (e.detail !== null) {
    const annotation = e.detail;
    document.getElementById('note-card-form').style.display = 'block';
    HasClicked = true;
    savedAnnotation = annotation;
  } else {
    const evt = new Event('add-annotation');
    document.dispatchEvent(evt);
  }
}, false);

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
  const evt = new CustomEvent('retrieve-annotation', { detail: annotation });
  document.dispatchEvent(evt);
}

function hideOrShowAnnotations() {
  if (isHidden === true) {
    var evt = new Event('hide-annotations');
    document.dispatchEvent(evt);
    $('#show-notes img').attr('src', '/img/pin-normal.svg');
    $('#show-info img').attr('src', '/img/details-normal.svg');
  } else {
    var evt = new Event('show-annotations');
    document.dispatchEvent(evt);
    $('#show-notes img').attr('src', '/img/pin-selected.svg');
    $('#show-info img').attr('src', '/img/details-normal.svg');
  }
}

function deselectAll() {
  for (annotation of allAnnotations) {
    annotation.isSelected = false;
    if (annotation.isImportant) {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #f44336';
      var evt = new CustomEvent('change-material', { detail: annotation });
      document.dispatchEvent(evt);
    } else {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
      var evt = new CustomEvent('change-material', { detail: annotation });
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
        var evt = new CustomEvent('change-material', { detail: annotation });
        document.dispatchEvent(evt);
      } else {
        document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
        var evt = new CustomEvent('change-material', { detail: annotation });
        document.dispatchEvent(evt);
      }
    }
  }
}

function addAnnotationCard(annotation) {
  const date = new Date(annotation.date);
  if (annotation.creator === null || annotation.creator === undefined)
    annotation.creator = 'undefined';
  if (annotation.date === null || annotation.date === undefined)
    annotation.date = 'undefined';
  if (annotation !== undefined && annotation.isImportant) {
    $('#note-list').prepend(`<li id=${annotation.name}-header class="collection-item-note">\n` +
        `            <div id="${annotation.name}" class="note-important">\n` +
        `                <p class="note-title"><strong>${annotation.title}</strong><a id="${annotation._id}" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
        `                <p class="note-creation-details"><span class="note-span">${annotation.creator.completeName}, </span><span class="note-span">${date.toDateString()}</span></p>\n` +
          `                <p class="note-content">${annotation.content}</p>\n` +
        '            </div>\n' +
        '        </li>');
  } else {
    $('#note-list').append(`<li id=${annotation.name}-header class="collection-item-note">\n` +
        `            <div id="${annotation.name}" class="note">\n` +
        `                <p class="note-title"><strong>${annotation.title}</strong><a id="${annotation._id}" href=#  style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
        `                <p class="note-creation-details"><span class="note-span">${annotation.creator.completeName}, </span><span class="note-span">${date.toDateString()}</span></p>\n` +
        `                <p class="note-content">${annotation.content}</p>\n` +
        '            </div>\n' +
        '        </li>');
  }
  $(`#${annotation._id}`).on('click', () => {
    socket.emit('[Annotation] - remove', annotation);
  });

  socket.on('[Annotation] - remove', deletedAnnotation => {
    allAnnotations = allAnnotations.filter(annot => annot.name !== deletedAnnotation.name);
    $(`#${deletedAnnotation.name}-header`).remove();
    const evt = new CustomEvent('delete-annotation', { detail: deletedAnnotation });
    document.dispatchEvent(evt);
  });

  $(`#${annotation.name}`).on('click', () => {
    deselectAllExceptClicked(annotation._id);
    annotation.isSelected = !annotation.isSelected;
    if (annotation.isSelected) {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #0DFFC8';
      var evt = new CustomEvent('select-annotation', { detail: annotation });
      document.dispatchEvent(evt);
    } else if (annotation.isImportant) {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #f44336';
      var evt = new CustomEvent('change-material', { detail: annotation });
      document.dispatchEvent(evt);
    } else {
      document.getElementById(annotation.name).style.borderLeft = '6px solid #296BB3';
      var evt = new CustomEvent('change-material', { detail: annotation });
      document.dispatchEvent(evt);
    }
  });
}

function reinitCardFormContent() {
  document.getElementById('note-content-input').value = '';
  document.getElementById('note-title-input').value = '';
  document.getElementById('check-if-important').checked = false;
}
