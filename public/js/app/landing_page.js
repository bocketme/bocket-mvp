$(document).ready(function () {
  $('#nameAccess').val('');
  $('#surnameAccess').val('');
  $('#email_beta').val('');
  $('#choiceAccess').val('');
  $('.carousel.carousel-slider').carousel({ fullWidth: true });
  $('select').material_select();
  $('.carousel-item').on('click', () => {
    $('.carousel').carousel('next');
  });
  $('.create-account').on('click', (event) => {
    $('#signIn').click();
  });
});
