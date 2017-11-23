
(function ($) {
  $(function () {
    //initialize all modals           
    $('.modal').modal();
    
    $('ul.tabs').tabs();

    $('.collapsible').collapsible();
    $('.collapsible').collapsible('open', 1);

    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
    
    $(".triple-dots").dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
    
    $('#create-part').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .7, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '2%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
    }
  );
  
  $('#create-part-button').click(() =>{
    $('#create-part').modal('open');
  })
  
  $('.chips').material_chip();
  
  $('.chips').on('chip.add', function(e, chip){
    // you have the added chip here
    console.log(e);
  });
  
  $('.button-form-validate').click((event) => {
    event.preventDefault();
    $.post('/test',function( data ) {
      console.log( $('#form-create-part').serialize(), $('#tags-create-part').material_chip('data'));
    }
  );
});

});
})(jQuery); // end of jQuery name space

