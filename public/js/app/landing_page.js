$(document).ready(function () {
  $('.carousel.carousel-slider').carousel({ fullWidth: true });
  $('select').material_select();
  $('.create-account').on('click', (event) => $('#signIn').click());
  let interval = makeInterval();
  $('#right_slide').click(() => {
    $('.carousel').carousel('next');
    clearInterval(interval);
    interval = makeInterval();
  });
  $('#left_slide').click(() => {
    $('.carousel').carousel('prev');
    clearInterval(interval);
    interval = makeInterval();
  });
});

const makeInterval = () => setInterval(() => $('.carousel').carousel('next'), 5000);
