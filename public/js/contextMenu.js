var menuState = false;
var activeClass = "specs-context-menu-active";
var gSelector;
var gSelectorId;
var pointedElem = null;

$(document).ready(function () {

  $("#form-change-pwd").submit(function(e) {
    e.preventDefault();
  });

  $('#header-specs').on("contextmenu", function (e) {
    e.preventDefault();
    toggleMenuContextOff();
    toggleMenuContextOn('#specs-context-menu');
  });

  $('#native').on('contextmenu', function (e) {
    e.preventDefault();
    toggleMenuContextOff();
    toggleMenuContextOn('#native-files');
  });

  $('.node-tree').on('contextmenu', 'li', function (e) {
    pointedElem = e.target;
    e.preventDefault();
    $(pointedElem).trigger('click');
    toggleMenuContextOff();
    toggleMenuContextOn('#node-tree-context-menu');
  });
});

/**
 * Open the menuContext
 * @param selectorId : JQuery id of the dropdown context menu
 */
function toggleMenuContextOn(selectorId) {
    var selector = $(selectorId);

    gSelector = selector;
    gSelectorId = selectorId;
    selector.addClass(activeClass);
    selector.addClass("active"); // add active class of materialize for dropdown behavior
    if (event) {
        var pos = getPosition(event);
        if (pos.x + selector.width() > $(window).width()) // move the dropdown to the left if he's too wide
            pos.x = $(window).width() - selector.width() - 10;
        if (pos.y + selector.height() > $(window).height()) // move the dropdown to the up if he's too wide
            pos.y =  $(window).height() - selector.height() - 10;
        selector.css("left", pos.x + "px").css("top", pos.y + "px");
    }
    menuState = true;
}

/**
 * close the context menu
 */
function toggleMenuContextOff() {
    if (gSelector !== undefined) {
        gSelector.removeClass("active");
        gSelector.removeClass(activeClass);
        menuState = false;
    }
}

$(document).ready(function(e) {
    /**
     * close the context menu when we click outside it
     */
    $(document).on("click", function (e) {
       if (menuState === true && $(e.target).parents(gSelectorId).length === 0) {
           toggleMenuContextOff();
       }
    });
});

/**
 * get mouse position
 * @param e
 * @returns {{x: number, y: number}}
 */
function getPosition(e) {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  }
}
