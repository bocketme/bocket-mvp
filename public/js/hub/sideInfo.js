let sideInfo = $('#side_info');
let sideInfoTrigger = $('#side_info_trigger');
let renderDiv = $('#renderDiv');

sideInfoTrigger.click(event => {
  renderDiv.animate({left: "+50", width:'toggle'},350);
});