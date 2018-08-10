$(document).ready(function () {
  $('#nameAccess').val('');
  $('#surnameAccess').val('');
  $('#email_beta').val('');
  $('#choiceAccess').val('');
  $('.carousel.carousel-slider').carousel({ fullWidth: true });
  $('select').material_select();
  $('.create-account').on('click', (event) => $('#signIn').click());
  $('#right_slide').click(() => $('.carousel').carousel('next'));
  $('#left_slide').click(() => $('.carousel').carousel('prev'));
  setInterval(() => $('.carousel').carousel('next'), 3000);
});
