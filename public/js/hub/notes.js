$(document).ready(() => {
  const notes = $('#notes');

  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('addAnnotationCard').style.display = 'block';
    console.log('add Note');
  });

  $('#addNoteButton').on('click', () => {
    console.log('Note well added');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#cancelNoteButton').on('click', () =>{
    console.log('Node canceled');
    document.getElementById('addAnnotationCard').style.display = 'none';
    // Ferme la note et ne l'ajoute pas dans la db
  });
});
