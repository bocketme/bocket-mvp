(function ($) {
  $(function () {
    //initialize all modals
    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .7, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '2%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        let context = "#" + modal.context.id;
        let form = $(context).find('form')
        if (form[0])
          form[0].reset();
      }
    });
    $(".collapsible").collapsible();
    $(".collapsible").collapsible('open', 1);

    $('.button-collapse').sideNav({
        menuWidth: 500, // Default is 300
        edge: 'right', // Choose the horizontal origin
      }
    );

    $('.dropdown-image').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });

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

    $('.pref-option-style').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'down', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
    $('.pref-option-style').on('click', () => {
      let top = $('#pref-option').css('top');
      $('#pref-option').css('top', (parseInt(top) + 20) + "px");
    });

    $('.team-option-style').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'down', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
    $('.team-option-style').on('click', () => {
      let top = $('#team-option').css('top');
      $('#team-option').css('top', (parseInt(top) + 20) + "px");
    });

    $('ul.tabs').tabs();

    $(".triple-dots").dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false, // Stops event propagation
    });

    $('#side-nav-close').click(event => {
      event.preventDefault();
      $('#side-info').sideNav('hide');
    });
    /*
    //Socket
    $('.chips').material_chip();
    */

    //Socket

    socket.on("updateWorkspaceList", (html) => {
      var listWorkspace = $('#list-workspace');
      listWorkspace.empty();
      listWorkspace.append(html);
      $('#trigger-creation-workspace').modal();
    });

    socket.on('nodeChild', (html, nodeId, force) => {
      console.log("Find Node Child");
      var collapsible_body = $('#' + nodeId + '-body');
      if (collapsible_body.hasClass("container") || force) {
        if (!force)
          collapsible_body.removeClass("container");
        collapsible_body.html(html);
        $(".collapsible").collapsible();
      }
    });
    var views = $(".view");
    views.mouseout(function () {
      $(this).removeClass("viewHover");
      $(this).addClass("viewNotHover");
      if (!$(this).hasClass("viewClicked"))
        $(this).addClass("viewNoteHover");
    });

    $(this).removeClass("viewNotHover");
    views.mouseover(function () {
      $(this).addClass("viewHover");
    });

    $('.part-editor').click((event) => {
      if (idOfchoosenNode) {
        let part = "/part/" + idOfchoosenNode + "/modeler";
        window.open(part, '_blank');
      } else Materialize.toast("You must select a part", 1000);
    });

    views.on("click", function () {
      views.removeClass("viewClicked");
      views.addClass("viewNotHover");
      $(this).removeClass("viewNotHover");
      $(this).removeClass("viewHover");
      $(this).addClass("viewClicked");
    });
    collapseOwners($("#location .owners"));

  });
})(jQuery); // end of jQuery name space

/**
 * Collapse the owners in location div
 * @param owners : JQueryElement
 */
function collapseOwners(owners) {
  var i = 0;
  var zIndex = owners.length;
  var move = 0;

  console.log("zIndex = ", zIndex);
  while (i < owners.length) {
    $(owners[i]).css("right", move + "%");
    $(owners[i]).css("z-index", zIndex--);
    i += 1;
    move += 8;
  }
}

/**
 * Transformator for the detail
 *
 * @type {Detail}
 */
const detail = new (class Detail{
  constructor(){
    this.title = $('#info-name');
    this.description = $('#info-description');
    this.creator = $('#info-creator');
    this.creation = $('#info-creation');
    this.organization = $('#info-owner');
  }

  /**
   * Update the data of Details.
   *
   * @param {Object} [info={}] - Information of the node selected
   * @param {String} info.name - The name of the node selected;
   * @param {String} info.description - The description of the node selected;
   * @param {String} info.creator - The creator of the node selected;
   * @param {String} info.organization - The organization of the node selected;
   * @memberof details
   */
  update(info = {}) {
    this.title.text(info.name);
    this.description.text(info.description);
    this.creator.text(info.creator);
    this.creation.text(moment(info.created).format("MMM Do YYYY"));
    this.organization.text(info.organization);
  }
})();

socket.on("[Node] - Details", (info) => {
  detail.update(info);
});

